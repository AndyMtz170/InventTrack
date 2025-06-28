const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    trim: true,
    unique: true
  },
  stock_inicial: {
    type: Number,
    required: [true, 'El stock inicial es obligatorio'],
    min: [0, 'El stock no puede ser negativo']
  },
  stock_actual: {
    type: Number,
    default: function() { return this.stock_inicial; },
    min: [0, 'El stock actual no puede ser negativo']
  },
  creado_por: {
    type: String,
    required: [true, 'El nombre del creador es obligatorio']
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  versionKey: false // Elimina el campo __v
});
