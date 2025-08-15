const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.crearUsuarioAdmin = async () => {
    try {
        const existeAdmin = await Usuario.findOne({ usuario: 'admin' });
        if (!existeAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            const admin = new Usuario({
                nombre: 'Administrador',
                usuario: 'admin',
                password: 'admin123',
                rol: 'admin'
            });
            
            await admin.save();
            console.log('Usuario administrador creado');
        }
    } catch (error) {
        console.error('Error al crear usuario administrador:', error);
    }
};

exports.iniciarSesion = async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const usuarioEncontrado = await Usuario.findOne({ usuario });
        if (!usuarioEncontrado) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }
        
        const esPasswordValido = await bcrypt.compare(password, usuarioEncontrado.password);
        console.log('Contraseña recibida:', password); // Debe ser 'admin123'
        console.log('Hash almacenado:', usuarioEncontrado.password);
        if (!esPasswordValido) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuarioEncontrado._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        const usuarioSinPassword = {
            _id: usuarioEncontrado._id,
            nombre: usuarioEncontrado.nombre,
            usuario: usuarioEncontrado.usuario,
            rol: usuarioEncontrado.rol
        };

        res.json({ 
            token,
            usuario: usuarioSinPassword
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerUsuarioAutenticado = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        
        // Devolver directamente los datos del usuario
        res.json({
            _id: req.user._id,
            nombre: req.user.nombre,
            usuario: req.user.usuario,
            rol: req.user.rol
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
