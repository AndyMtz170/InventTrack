// backend/controllers/productoController.js
const ProductoService = require('../services/productoService');

class ProductoController {
    static async crearProducto(req, res) {
        try {
            const producto = await ProductoService.crearProducto(req.body);
            res.status(201).json(producto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async obtenerProductos(req, res) {
        try {
            const productos = await ProductoService.obtenerProductos();
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async obtenerProducto(req, res) {
        try {
            const producto = await ProductoService.obtenerProductoPorId(req.params.id);
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(producto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async actualizarProducto(req, res) {
        try {
            const producto = await ProductoService.actualizarProducto(req.params.id, req.body);
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(producto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async eliminarProducto(req, res) {
        try {
            const producto = await ProductoService.eliminarProducto(req.params.id);
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ProductoController;