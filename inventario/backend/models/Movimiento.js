const mongoose = require('mongoose');

const MovimientoSchema = new mongoose.Schema({
  producto_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: [true, 'El ID del producto es obligatorio']
  },
  usuario_id: {
    type: String,
    required: [true, 'El ID del usuario es obligatorio'],
    minlength: [3, 'El ID de usuario debe tener al menos 3 caracteres']
  },
  tipo: {
    type: String,
    enum: {
      values: ['entrada', 'salida'],
      message: 'El tipo debe ser "entrada" o "salida"'
    },
    required: [true, 'El tipo de movimiento es obligatorio']
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [1, 'La cantidad mínima es 1']
  },
  fecha: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  descripcion: {
    type: String,
    maxlength: [100, 'La descripción no puede exceder 100 caracteres'],
    trim: true
  }
}, {
  versionKey: false // Elimina el campo __v
});

module.exports = mongoose.model('Movimiento', MovimientoSchema);
