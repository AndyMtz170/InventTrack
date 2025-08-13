require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventario');
    
    // Eliminar usuarios existentes
    await Usuario.deleteMany({});
    console.log('Usuarios existentes eliminados');

    // Crear usuario administrador con contraseña en texto plano
    const adminUser = new Usuario({
      nombre: 'Administrador',
      usuario: 'admin',
      password: 'admin123', // El middleware de Mongoose hasheará esta contraseña
      rol: 'admin'
    });

    const savedUser = await adminUser.save();
    console.log('Usuario administrador creado:', savedUser);

    // Verificar contraseña
    const passwordMatch = await savedUser.compararPassword('admin123');
    console.log('Verificación de contraseña:', passwordMatch);
    
  } catch (error) {
    console.error('Error al crear usuario administrador:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdminUser();