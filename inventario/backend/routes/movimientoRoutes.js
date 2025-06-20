// backend/routes/movimientoRoutes.js
const express = require('express');
const MovimientoController = require('../controllers/movimientoController');

const router = express.Router();

router.post('/', MovimientoController.crearMovimiento);
router.get('/', MovimientoController.obtenerMovimientos);
router.get('/producto/:productoId', MovimientoController.obtenerMovimientosPorProducto);
router.get('/:id', MovimientoController.obtenerMovimiento);

module.exports = router;