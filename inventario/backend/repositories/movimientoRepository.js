const mongoose = require('mongoose');
const Movimiento = require('../models/Movimiento');

class MovimientoRepository {
  async crear(datos) {
    const movimiento = new Movimiento(datos);
    return await movimiento.save();
  }
  async crear(movimientoData) {
    try {
      console.log('Creando movimiento con datos:', movimientoData);
      
      const movimiento = new Movimiento({
        producto: movimientoData.producto,  // CAMBIADO de producto_id a producto
        usuario: movimientoData.usuario,    // CAMBIADO de usuario_id a usuario
        tipo: movimientoData.tipo,
        cantidad: movimientoData.cantidad
      });
      
      const validationError = movimiento.validateSync();
      if (validationError) {
        console.error('Error de validación detallado:', validationError.errors);
        throw validationError;
      }
      
      const saved = await movimiento.save();
      console.log('Movimiento guardado exitosamente:', saved);
      return saved;
    } catch (error) {
      console.error('Error completo al crear movimiento:', error);
      
      if (error.name === 'ValidationError') {
        const errorDetails = {};
        for (const field in error.errors) {
          errorDetails[field] = {
            message: error.errors[field].message,
            value: error.errors[field].value
          };
        }
        throw new Error(`Error de validación: ${JSON.stringify(errorDetails)}`);
      }
      
      throw error;
    }
  }

  async obtenerPorProducto(productoId) {
    return Movimiento.find({ producto: productoId })  // CAMBIADO de producto_id a producto
      .populate('usuario', 'nombre') 
      .populate('producto', 'nombre') 
      .sort({ createdAt: -1 });
  }

  async obtenerTodos() {
    return Movimiento.find()
      .populate('usuario', 'nombre')
      .populate('producto', 'nombre')
      .sort({ createdAt: -1 });
  }
  
  async existenMovimientosParaProducto(productoId) {
    const count = await Movimiento.countDocuments({ producto: productoId });  // CAMBIADO
    return count > 0;
  }
}

module.exports = MovimientoRepository;