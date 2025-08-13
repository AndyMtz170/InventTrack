class MovimientoController {
  constructor(movimientoService) {
    this.movimientoService = movimientoService;
  }

  async crearMovimiento(req, res) {
    try {
      console.log('Usuario autenticado:', req.user);
      console.log('Datos recibidos en body:', req.body);
      const movimientoData = {
        producto: req.body.producto,
        tipo: req.body.tipo,
        cantidad: req.body.cantidad,
        usuario: req.user._id
      };
      
      console.log('Datos del movimiento a registrar:', movimientoData);
      const movimiento = await this.movimientoService.registrarMovimiento(movimientoData);
      res.status(201).json(movimiento);
    } catch (error) {
      console.error('Error detallado en movimientoController:', error);
      
      let errorMessage = error.message;
      try {
        const errorDetails = JSON.parse(error.message.split('Error de validación: ')[1]);
        errorMessage += ` | Detalles: ${JSON.stringify(errorDetails)}`;
      } catch (e) {
        // No es un error de validación estructurado
      }
      
      res.status(400).json({ 
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  async obtenerTodos(req, res) {
    try {
      const movimientos = await this.movimientoService.obtenerTodosLosMovimientos();
      res.json(movimientos);
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerHistorial(req, res) {
    try {
      const { productoId } = req.params;
      const movimientos = await this.movimientoService.obtenerMovimientosPorProducto(productoId);
      res.json(movimientos);
    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MovimientoController;