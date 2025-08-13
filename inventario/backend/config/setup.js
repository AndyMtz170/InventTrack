const usuarioRepository = require('./repositories/usuarioRepository');

const inicializarAdmin = async () => {
  try {
    const adminExiste = await usuarioRepository.usuarioExiste('admin');
    
    if (!adminExiste) {
      await usuarioRepository.create({
        nombre: 'Administrador',
        usuario: 'admin',
        password: 'AdminPassword123', 
        rol: 'admin'
      });
      console.log('Usuario administrador creado');
    } else {
      console.log('Usuario administrador ya existe');
    }
  } catch (error) {
    console.error('Error al inicializar admin:', error);
  }
};

module.exports = inicializarAdmin;