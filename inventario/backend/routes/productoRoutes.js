// backend/routes/productoRoutes.js
const express = require('express');
const ProductoController = require('../controllers/productoController');

const router = express.Router();

router.post('/', ProductoController.crearProducto);
router.get('/', ProductoController.obtenerProductos);
router.get('/:id', ProductoController.obtenerProducto);
router.put('/:id', ProductoController.actualizarProducto);
router.delete('/:id', ProductoController.eliminarProducto);

module.exports = router;