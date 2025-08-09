// backend/scripts/fixTokens.js
require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

async function fixInvalidTokens() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB para reparación de tokens');
    
    const usuarios = await Usuario.find();
    let fixedCount = 0;
    
    for (const usuario of usuarios) {
      try {
        // Intentar verificar el token actual
        jwt.verify(usuario.token, process.env.JWT_SECRET);
      } catch (error) {
        if (error.message.includes('invalid signature')) {
          // Generar nuevo token válido
          const newToken = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
          );
          
          // Actualizar usuario
          usuario.token = newToken;
          await usuario.save();
          console.log(`Token reparado para usuario: ${usuario.usuario}`);
          fixedCount++;
        }
      }
    }
    
    console.log(`Proceso completado. Tokens reparados: ${fixedCount}`);
    
  } catch (error) {
    console.error('Error en reparación de tokens:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Ejecutar solo si no hay tokens reparados
fixInvalidTokens();