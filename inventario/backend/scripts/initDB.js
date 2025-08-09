// backend/scripts/initDB.js
const mongoose = require('mongoose');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');

async function initDatabase() {
  // Conexión a MongoDB
  await mongoose.connect('mongodb://localhost:27017/inventarioAuditoria');

  // Datos iniciales
  const admin = await Usuario.create({
    nombre: 'Admin',
    email: 'admin@inventario.com',
    rol: 'admin'
  });

  await Producto.create({
    nombre: 'Producto Ejemplo',
    stock_inicial: 100,
    stock_actual: 100,
    creado_por: admin._id
  });

  console.log('Base de datos inicializada');
  process.exit(0);
}

initDatabase().catch(err => console.error('Error:', err));