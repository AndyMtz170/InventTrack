const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Importa directamente los módulos
const MovimientoController = require('../controllers/movimientoController');
const MovimientoService = require('../services/movimientoService');
const MovimientoRepository = require('../repositories/movimientoRepository');
const ProductoRepository = require('../repositories/productoRepository');
const Movimiento = require('../models/Movimiento');
const Producto = require('../models/Producto');

// Crea las instancias
const movimientoRepo = new MovimientoRepository(Movimiento);
const productoRepo = new ProductoRepository(Producto);
const movimientoService = new MovimientoService(movimientoRepo, productoRepo);
const movimientoController = new MovimientoController(movimientoService);

// Middleware de autenticación aplicado a TODAS las rutas
router.use(authMiddleware);

// Rutas
router.post('/', (req, res) => movimientoController.crearMovimiento(req, res));
router.get('/', (req, res) => movimientoController.obtenerTodos(req, res));
router.get('/:productoId/historial', (req, res) => movimientoController.obtenerHistorial(req, res));

module.exports = router;