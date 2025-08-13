const mongoose = require('mongoose');

class MovimientoService {
  constructor(movimientoRepo, productoRepo) {
    this.movimientoRepo = movimientoRepo;
    this.productoRepo = productoRepo;
  }

  async registrarMovimiento(movimientoData) {
    try {
      console.log('Datos recibidos para movimiento:', movimientoData);
      
      // Validación de campos requeridos
      const camposRequeridos = ['producto', 'usuario', 'tipo', 'cantidad'];
      const camposFaltantes = camposRequeridos.filter(campo => !movimientoData[campo]);
      
      if (camposFaltantes.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${camposFaltantes.join(', ')}`);
      }

      // Validación de tipo
      if (!['entrada', 'salida'].includes(movimientoData.tipo)) {
        throw new Error('Tipo de movimiento inválido. Debe ser "entrada" o "salida"');
      }
      
      // Validación de cantidad
      if (typeof movimientoData.cantidad !== 'number' || movimientoData.cantidad <= 0) {
        throw new Error('Cantidad debe ser un número positivo mayor que 0');
      }

      // Validación de ObjectIds
      if (!mongoose.isValidObjectId(movimientoData.producto)) {
        throw new Error('ID de producto inválido');
      }

      if (!mongoose.isValidObjectId(movimientoData.usuario)) {
        throw new Error('ID de usuario inválido');
      }

      // Verificar que el producto existe
      const producto = await this.productoRepo.obtenerPorId(movimientoData.producto);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      // Calcular nuevo stock
      let nuevoStock = producto.stock_actual;
      
      if (movimientoData.tipo === 'entrada') {
        nuevoStock += movimientoData.cantidad;
      } else {
        // Verificación de stock suficiente
        if (producto.stock_actual < movimientoData.cantidad) {
          throw new Error(`Stock insuficiente. Disponible: ${producto.stock_actual}`);
        }
        nuevoStock -= movimientoData.cantidad;
        // Eliminar verificación redundante de nuevoStock < 0
      }

      // Actualizar el stock del producto - CORREGIDO: usar método actualizar
      await this.productoRepo.actualizar(movimientoData.producto, {
        stock_actual: nuevoStock
      });
      
      // Crear movimiento 
      return this.movimientoRepo.crear({
        producto: movimientoData.producto,
        usuario: movimientoData.usuario,
        tipo: movimientoData.tipo,
        cantidad: movimientoData.cantidad,
       });
    } catch (error) {
      console.error('Error detallado en movimientoService:', error);
      throw error;
    }
  }
  
  async obtenerTodosLosMovimientos() {
    return this.movimientoRepo.obtenerTodos();
  }
  
  async obtenerMovimientosPorProducto(productoId) {
    return this.movimientoRepo.obtenerPorProducto(productoId);
  }
}

module.exports = MovimientoService;