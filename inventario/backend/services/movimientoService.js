const mongoose = require('mongoose');

class MovimientoService {
  constructor(movimientoRepo, productoRepo) {
    this.movimientoRepo = movimientoRepo;
    this.productoRepo = productoRepo;
  }

  async registrarMovimiento(movimientoData) {
    // Validación de campos requeridos
    const camposRequeridos = ['producto_id', 'usuario_id', 'tipo', 'cantidad'];
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
    if (!mongoose.Types.ObjectId.isValid(movimientoData.producto_id)) {
      throw new Error('ID de producto inválido');
    }

    if (!mongoose.Types.ObjectId.isValid(movimientoData.usuario_id)) {
      throw new Error('ID de usuario inválido');
    }

    // Verificar que el producto existe
    const producto = await this.productoRepo.obtenerPorId(movimientoData.producto_id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // Calcular nuevo stock
    let nuevoStock = producto.stock_actual;
    
    if (movimientoData.tipo === 'entrada') {
      nuevoStock += movimientoData.cantidad;
    } else {
      nuevoStock -= movimientoData.cantidad;
      if (nuevoStock < 0) {
        throw new Error(`Stock insuficiente. Disponible: ${producto.stock_actual}`);
      }
    }

    // Actualizar el stock del producto
    await this.productoRepo.actualizarStock(movimientoData.producto_id, nuevoStock);

    // Crear movimiento
    return this.movimientoRepo.crear(movimientoData);
  }
}

module.exports = MovimientoService;