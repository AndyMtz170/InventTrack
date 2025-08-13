const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  stock_inicial: {
    type: Number,
    required: true,
    min: 0
  },
  stock_actual: {
    type: Number,
    required: true,
    min: 0,
    default: function() { return this.stock_inicial; }
  },
  creado_por: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Producto', ProductoSchema);