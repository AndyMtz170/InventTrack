// backend/services/productoService.js
const Producto = require('../models/Producto');

class ProductoService {
    static async crearProducto(productoData) {
        productoData.stock_actual = productoData.stock_inicial;
        const producto = new Producto(productoData);
        return await producto.save();
    }

    static async obtenerProductos() {
        return await Producto.find().populate('creado_por', 'nombre email');
    }

    static async obtenerProductoPorId(id) {
        return await Producto.findById(id).populate('creado_por', 'nombre email');
    }

    static async actualizarProducto(id, productoData) {
        return await Producto.findByIdAndUpdate(id, productoData, { new: true });
    }

    static async eliminarProducto(id) {
        return await Producto.findByIdAndDelete(id);
    }

    static async verificarStock(id, cantidad) {
        const producto = await Producto.findById(id);
        return producto.stock_actual >= cantidad;
    }
}

module.exports = ProductoService;