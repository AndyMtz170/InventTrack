const mongoose = require('mongoose');
const Movimiento = require('../models/Movimiento');

class MovimientoRepository {
  async crear(movimientoData) {
    try {
      const movimiento = new Movimiento({
        producto_id: new mongoose.mongo.ObjectId(movimientoData.producto_id),
        usuario_id:movimientoData.usuario_id,
        tipo: movimientoData.tipo,
        cantidad: Number(movimientoData.cantidad) // Asegurar que sea número
      });
      console.log(movimiento)
      return await movimiento.save();
    } catch (error) {
      console.log(error)
      // Mejorar mensajes de error
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        throw new Error(`Error de validación: ${errors.join(', ')}`);
      }
      throw error;
    }
  }

  async obtenerPorProducto(productoId) {
    return Movimiento.find({ producto_id: productoId })
      .populate('usuario_id', 'nombre') 
      .populate('producto_id', 'nombre') 
      .sort({ createdAt: -1 });
  }

  async obtenerTodos() {
    return Movimiento.find()
      .populate('usuario_id', 'nombre')
      .populate('producto_id', 'nombre')
      .sort({ createdAt: -1 });
  }
  
  async existenMovimientosParaProducto(productoId) {
    const count = await Movimiento.countDocuments({ producto_id: productoId });
    return count > 0;
  }
}

module.exports = MovimientoRepository;