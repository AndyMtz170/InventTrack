// backend/models/Producto.js
const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    stock_inicial: {
        type: Number,
        required: true,
        min: 0
    },
    stock_actual: {
        type: Number,
        default: 0
    },
    creado_por: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Producto', ProductoSchema);