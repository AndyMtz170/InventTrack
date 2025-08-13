const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para inicio de sesión (POST)
router.post('/login', authController.iniciarSesion);

// Ruta protegida para obtener usuario autenticado (GET)
router.get('/usuario', authMiddleware, authController.obtenerUsuarioAutenticado);

module.exports = router;