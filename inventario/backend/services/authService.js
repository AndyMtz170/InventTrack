const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/usuarioRepository');
const bcrypt = require('bcryptjs');

class AuthService {
  async autenticarUsuario(usuario, password) {
    if (!usuario || !password) {
      throw new Error('Usuario y contraseña son requeridos');
    }

    const user = await usuarioRepository.findByUsuario(usuario);
    if (!user) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    const passwordCorrecto = await bcrypt.compare(password, user.password);
    if (!passwordCorrecto) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    const token = jwt.sign(
    { 
        id: user._id.toString(),
        nombre: user.nombre,   // Añadir nombre
        usuario: user.usuario, // Añadir usuario
        rol: user.rol 
    },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return { 
      token, 
      user: {
        _id: user._id,
        nombre: user.nombre,
        usuario: user.usuario,
        rol: user.rol
      }
    };
  }

  async obtenerUsuarioPorId(id) {
    return usuarioRepository.findById(id);
  }
}

module.exports = new AuthService();