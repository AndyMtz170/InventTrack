repository.js
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const Movimiento = require('./models/Movimiento');

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/inventario',);

// Obtener producto por ID
async function getProductoById(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID de producto no válido');
    }
    
    const producto = await Producto.findById(id).lean();
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    return producto;
  } catch (error) {
    console.error(`Error en repository.getProductoById: ${error.message}`);
    throw error;
  }
}

// Obtener movimientos por ID de producto
async function getMovimientosByProductoId(productoId) {
  try {
    return await Movimiento.find({ producto_id: productoId }).lean();
  } catch (error) {
    console.error(`Error en repository.getMovimientosByProductoId: ${error.message}`);
    throw error;
  }
}

module.exports = {
  getProductoById,
  getMovimientosByProductoId
};