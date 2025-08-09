const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

module.exports = async function(req, res, next) {
    // Obtener token de diferentes fuentes
     let token = (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null) || 
                req.cookies.token || 
                req.header('x-auth-token');
    // No hay token
    if (!token) {
        return res.status(401).json({ 
            error: 'Acceso denegado',
            message: 'Token de autenticación requerido'
        });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Obtener usuario completo con sus datos
        const usuario = await Usuario.findById(decoded.id)
            .select('_id nombre usuario rol')
            .lean();
        
        if (!usuario) {
            return res.status(401).json({ 
                error: 'Usuario no encontrado',
                message: 'El usuario asociado al token no existe'
            });
        }
        
        // Añadir usuario completo al request usando _id consistentemente
        req.user = {
            _id: usuario._id,
            nombre: usuario.nombre,
            usuario: usuario.usuario,
            rol: usuario.rol
        };
        
        next();
    } catch (error) {
        // Manejar diferentes tipos de errores
        let errorMessage = 'Token inválido';
        let statusCode = 401;
        
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Token expirado';
        } else if (error.name === 'JsonWebTokenError') {
            if (error.message.includes('invalid signature')) {
                errorMessage = 'Firma inválida - verifique JWT_SECRET';
            } else if (error.message.includes('jwt malformed')) {
                errorMessage = 'Token mal formado';
            }
        } else if (error.name === 'CastError') {
            errorMessage = 'ID de usuario inválido';
            statusCode = 400;
        }
        
        console.error('Error en middleware de autenticación:', error.message);
        
        res.status(statusCode).json({ 
            error: errorMessage,
            message: 'Por favor, inicie sesión nuevamente'
        });
    }
};