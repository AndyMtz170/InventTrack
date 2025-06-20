// backend/controllers/movimientoController.js
const MovimientoService = require('../services/movimientoService');

class MovimientoController {
    static async crearMovimiento(req, res) {
        try {
            const movimiento = await MovimientoService.crearMovimiento(req.body);
            res.status(201).json(movimiento);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async obtenerMovimientos(req, res) {
        try {
            const movimientos = await MovimientoService.obtenerMovimientos();
            res.json(movimientos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async obtenerMovimientosPorProducto(req, res) {
        try {
            const movimientos = await MovimientoService.obtenerMovimientosPorProducto(req.params.productoId);
            res.json(movimientos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async obtenerMovimiento(req, res) {
        try {
            const movimiento = await MovimientoService.obtenerMovimientoPorId(req.params.id);
            if (!movimiento) {
                return res.status(404).json({ error: 'Movimiento no encontrado' });
            }
            res.json(movimiento);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = MovimientoController;