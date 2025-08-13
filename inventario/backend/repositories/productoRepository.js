const Producto = require('../models/Producto');
const mongoose = require('mongoose');

class ProductoRepository {
  async crear(productoData) {
    return Producto.create(productoData);
  }

  async obtenerTodos() {
    return Producto.find();
  }

  async obtenerPorId(id) {
    return Producto.findById(id);
  }

  async actualizar(id, productoData) {
    return Producto.findByIdAndUpdate(id, productoData, { new: true });
  }

  async actualizarStock(id, nuevoStock) {
    return Producto.findByIdAndUpdate(
      id, 
      { stock_actual: nuevoStock },
      { new: true }
    );
  }

  async eliminar(id) {
    return Producto.findByIdAndDelete(id);
  }
  
  async existe(id) {
    const count = await Producto.countDocuments({ _id: id });
    return count > 0;
  }
  
  async existeConNombre(nombre) {
    const count = await Producto.countDocuments({ nombre });
    return count > 0;
  }
  
  async obtenerPorNombre(nombre) {
    return Producto.findOne({ nombre });
  }
  
  async tieneMovimientos(id) {
    const count = await mongoose.model('Movimiento').countDocuments({ producto_id: id });
    return count > 0;
  }

  // Nuevo método para actualizar stock
  async actualizarStock(id, nuevoStock) {
    return Producto.findByIdAndUpdate(
      id, 
      { stock_actual: nuevoStock },
      { new: true }
    );
  }
}

module.exports = ProductoRepository;