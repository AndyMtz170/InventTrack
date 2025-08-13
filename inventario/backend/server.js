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
  origin: 'http://localhost:3000', // Asegúrate que coincide con tu frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  exposedHeaders: ['Authorization', 'x-auth-token']
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('\nConectado a MongoDB');
    createAdminIfNotExists();
  })
  .catch(err => {
    console.error('Error de conexión a MongoDB:', err);
    process.exit(1);
  });

// CORRECCIÓN PRINCIPAL: Crear usuario administrador correctamente
async function createAdminIfNotExists() {
  try {
    const Usuario = require('./models/Usuario');
    
    // Buscar si ya existe el usuario admin
    const adminExiste = await Usuario.findOne({ usuario: 'admin' });
    
    if (!adminExiste) {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Crear nuevo usuario admin
      await Usuario.create({
        nombre: 'Administrador',
        usuario: 'admin',
        password: hashedPassword,
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
  }
}

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

// Manejador global de errores
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

// Iniciar servidor
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