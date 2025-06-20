// backend/services/movimientoService.js
const Movimiento = require('../models/Movimiento');
const Producto = require('../models/Producto');

class MovimientoService {
    static async crearMovimiento(movimientoData) {
        const producto = await Producto.findById(movimientoData.producto_id);
        
        if (!producto) {
            throw new Error('Producto no encontrado');
        }

        if (movimientoData.tipo === 'salida' && producto.stock_actual < movimientoData.cantidad) {
            throw new Error('Stock insuficiente');
        }

        // Actualizar stock del producto
        producto.stock_actual = movimientoData.tipo === 'entrada' 
            ? producto.stock_actual + movimientoData.cantidad 
            : producto.stock_actual - movimientoData.cantidad;

        await producto.save();

        const movimiento = new Movimiento(movimientoData);
        return await movimiento.save();
    }

    static async obtenerMovimientos() {
        return await Movimiento.find()
            .populate('producto_id', 'nombre')
            .populate('usuario_id', 'nombre email');
    }

    static async obtenerMovimientosPorProducto(productoId) {
        return await Movimiento.find({ producto_id: productoId })
            .populate('usuario_id', 'nombre email')
            .sort({ fecha: -1 });
    }

    static async obtenerMovimientoPorId(id) {
        return await Movimiento.findById(id)
            .populate('producto_id', 'nombre')
            .populate('usuario_id', 'nombre email');
    }
}

module.exports = MovimientoService;