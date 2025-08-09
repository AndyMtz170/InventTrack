class MovimientoController {
  constructor(service) {
    this.service = service;
  }

  async crearMovimiento(req, res) {
    try {
      const usuario = req.user;
        
      if (!usuario || !usuario._id) {
          throw new Error('Usuario no autenticado');
      }
      
      // mostrar datos recibidos
      console.log('Datos recibidos para movimiento:', {
        ...req.body,
        usuario_id: usuario._id
      });
      
      const movimiento = await this.service.registrarMovimiento({
        ...req.body,
        usuario_id: usuario._id
      });
      
      res.status(201).json(movimiento);
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      res.status(400).json({ 
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }

  async obtenerHistorial(req, res) {
    try {
      const historial = await this.service.obtenerHistorial(req.params.productoId);
      res.json(historial);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerTodos(req, res) {
    try {
      const movimientos = await this.service.obtenerTodosLosMovimientos();
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MovimientoController;