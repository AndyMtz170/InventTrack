class ProductoService {
  constructor(productoRepository, movimientoRepository) {
    this.productoRepository = productoRepository;
    this.movimientoRepository = movimientoRepository;
  }

  async crearProducto(productoData) {
    // Validaciones básicas
    if (!productoData.nombre || productoData.nombre.trim() === '') {
      throw new Error('El nombre del producto es obligatorio');
    }
    
    if (productoData.stock_inicial === undefined) {
      throw new Error('El stock inicial es obligatorio');
    }
    
    if (productoData.stock_inicial < 0) {
      throw new Error('El stock inicial no puede ser negativo');
    }
    
    // Validar que el creador esté presente
    if (!productoData.creado_por || productoData.creado_por.trim() === '') {
      throw new Error('Se requiere información del creador');
    }
    
    // Validar nombre único
    const existe = await this.productoRepository.existeConNombre(productoData.nombre);
    if (existe) {
      throw new Error('Ya existe un producto con ese nombre');
    }
    
    // Crear producto con stock actual igual al inicial
    return this.productoRepository.crear({
      ...productoData,
      stock_actual: productoData.stock_inicial
    });
  }

  async obtenerProductos() {
    return this.productoRepository.obtenerTodos();
  }

  async obtenerProductoPorId(id) {
    if (!id || id.length !== 24) {
      throw new Error('ID de producto inválido');
    }
    
    const producto = await this.productoRepository.obtenerPorId(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  async actualizarProducto(id, productoData) {
    const { stock_actual, ...datosActualizacion } = productoData;
    
    // Validar existencia del producto
    const existe = await this.productoRepository.existe(id);
    if (!existe) {
      throw new Error('Producto no encontrado');
    }
    
    // Validar stock inicial no negativo
    if (datosActualizacion.stock_inicial !== undefined && datosActualizacion.stock_inicial < 0) {
      throw new Error('El stock no puede ser negativo');
    }
    
    // Validar nombre único si se cambia
    if (datosActualizacion.nombre) {
      const productoConMismoNombre = await this.productoRepository.obtenerPorNombre(datosActualizacion.nombre);
      if (productoConMismoNombre && productoConMismoNombre._id.toString() !== id) {
        throw new Error('Ya existe otro producto con ese nombre');
      }
    }
    
    return this.productoRepository.actualizar(id, datosActualizacion);
  }

  async eliminarProducto(id) {
    // Validar existencia del producto
    const producto = await this.productoRepository.obtenerPorId(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    // Verificar si tiene movimientos asociados
    const tieneMovimientos = await this.movimientoRepository.existenMovimientosParaProducto(id);
    if (tieneMovimientos) {
      throw new Error('No se puede eliminar un producto con movimientos registrados');
    }
    
    return this.productoRepository.eliminar(id);
  }

  async obtenerHistorialProducto(productoId) {
    // Validar existencia del producto
    const existe = await this.productoRepository.existe(productoId);
    if (!existe) {
      throw new Error('Producto no encontrado');
    }
    
    return this.movimientoRepository.obtenerPorProducto(productoId);
  }
}

module.exports = ProductoService;