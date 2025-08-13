const mongoose = require('mongoose');

const MovimientoSchema = new mongoose.Schema({
  producto: {  // CAMBIADO de producto_id a producto
    type: mongoose.ObjectId,
    required: true
  },
  usuario: {  // CAMBIADO de usuario_id a usuario
    type: mongoose.ObjectId,
    required: true
  },
  tipo: {
    type: String,
    enum: ['entrada', 'salida'],
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movimiento', MovimientoSchema);