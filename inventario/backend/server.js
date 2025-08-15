const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

// .env
const envPath = path.resolve(__dirname, '.env');
console.log('Buscando archivo .env en:', envPath);

// Variables de entorno
if (fs.existsSync(envPath)) {
  dotenv.config({ 
    path: envPath,
    debug: false
  });
  console.log('Archivo .env encontrado y cargado');
} else {
  console.error('ERROR: Archivo .env no encontrado en:', envPath);
  console.error('Por favor, crea un archivo .env en el directorio backend con:');
  console.error('MONGODB_URI=mongodb://localhost:27017/inventario');
  console.error('JWT_SECRET=una_clave_secreta_muy_compleja_y_larga');
  process.exit(1);
}

// Variables de entorno críticas
console.log('\nVariables de entorno cargadas:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '*** (presente)' : 'No definida');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '*** (presente)' : 'NO DEFINIDA - ESTO CAUSARÁ ERRORES');

if (!process.env.JWT_SECRET) {
  console.error('\nERROR CRÍTICO: JWT_SECRET no está definido en las variables de entorno');
  process.exit(1);
}

// Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use(cookieParser());

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  exposedHeaders: ['Authorization', 'x-auth-token']
}));

// =============================================
// CONEXIÓN A MONGODB E INICIALIZACIÓN
// =============================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('\nConectado a MongoDB');
    return createAdminIfNotExists();
  })
  .then(() => repararUsuarios())
  .then(() => {
    // Iniciar servidor DESPUÉS de inicializar DB
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`
      Servidor funcionando en http://localhost:${PORT}
      Modo: ${process.env.NODE_ENV || 'development'}
      Auth:        http://localhost:${PORT}/api/auth
      Productos:   http://localhost:${PORT}/api/productos
      Movimientos: http://localhost:${PORT}/api/movimientos
      `);
    });
  })
  .catch(err => {
    console.error('Error durante la inicialización:', err);
    process.exit(1);
  });

// =============================================
// FUNCIÓN PARA CREAR ADMINISTRADOR
// =============================================
async function createAdminIfNotExists() {
  try {
    const Usuario = require('./models/Usuario');
    
    // Buscar si ya existe el usuario admin
    const adminExiste = await Usuario.findOne({ usuario: 'admin' });
    
    if (!adminExiste) {
      // Crear nuevo usuario admin
      await Usuario.create({
        nombre: 'Administrador',
        usuario: 'admin',
        password: 'admin123',
        rol: 'admin'
      });
      
      console.log('\nUsuario administrador creado');
      console.log('Credenciales:');
      console.log('Usuario: admin');
      console.log('Contraseña: admin123');
    } else {
      console.log('\nUsuario administrador ya existe - no se requiere acción');
    }
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
    throw error; // Propaga el error para ser capturado por el catch global
  }
}

// =============================================
// FUNCIÓN PARA REPARAR USUARIO ADMIN
// =============================================
async function repararUsuarios() {
  try {
    const Usuario = require('./models/Usuario');
    const usuarios = await Usuario.find();
    
    for (const usuario of usuarios) {
      if (usuario.usuario === 'admin') {
        // Restablecer contraseña temporal
        usuario.password = 'admin123';
        
        // Guardar activará middleware (hash correcto)
        await usuario.save();
        
        console.log(`\nUsuario ${usuario.usuario} reparado. Contraseña temporal: admin123`);
        console.log('==============================================================');
      }
    }
  } catch (error) {
    console.error('Error al reparar usuarios:', error);
    throw error; // Propaga el error
  }
}

// =============================================
// CONFIGURACIÓN DE RUTAS
// =============================================

// Rutas estáticas
const frontendDir = path.join(__dirname, '..', 'frontend');
const indexPath = path.join(frontendDir, 'index.html');

// Servir archivos estáticos
app.use(express.static(frontendDir));

// Importar rutas
const productoRoutes = require('./routes/productoRoutes');
const movimientoRoutes = require('./routes/movimientoRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware de autenticación
const authMiddleware = require('./middlewares/authMiddleware');

// Montar rutas API
app.use('/api/auth', authRoutes);
app.use('/api/productos', authMiddleware, productoRoutes);
app.use('/api/movimientos', authMiddleware, movimientoRoutes);

// Manejar rutas API no encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint API no encontrado',
    path: req.originalUrl
  });
});

// Ruta de fallback para SPA
app.get('*', (req, res) => {
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('Error: index.html no encontrado');
  }
  res.sendFile(indexPath);
});

// =============================================
// MANEJADOR GLOBAL DE ERRORES
// =============================================
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  
  // Respuesta de error para API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.status || 500).json({ 
      error: 'Error interno del servidor',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
  
  res.status(500).send('<h1>Error interno del servidor</h1>');
});
