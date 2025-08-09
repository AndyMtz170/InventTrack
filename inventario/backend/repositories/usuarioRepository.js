const Usuario = require('../models/Usuario');

class UsuarioRepository {
  async findByUsuario(usuario) {
    return Usuario.findOne({ usuario: usuario.toLowerCase().trim() });
  }

  async findById(id) {
    return Usuario.findById(id).select('-password -__v');
  }

  async create(usuarioData) {
    // Normalizar antes de crear
    usuarioData.usuario = usuarioData.usuario.toLowerCase().trim();
    const usuario = new Usuario(usuarioData);
    return usuario.save();
  }

  // Método para verificar existencia de usuario
  async usuarioExiste(usuario) {
    const count = await Usuario.countDocuments({ 
      usuario: usuario.toLowerCase().trim() 
    });
    return count > 0;
  }
}

module.exports = new UsuarioRepository();