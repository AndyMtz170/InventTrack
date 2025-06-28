# InventTrack
En este repositorio haremos un proyecto sobre sistema de inventario con auditoria de movimiento o eso espero.
1. Descripción:
-Sistema para registrar movimientos de inventario con historial y validaciones.
2. Requerimientos funcionales:
-CRUD de productos y movimientos.
-Registro del usuario que ejecuta cada movimiento.
-Consulta del historial por producto.
3. Base de datos sugerida:
-Productos(id, nombre, stock_inicial)
-Movimientos(id, producto_id, usuario_id, tipo, cantidad, fecha)
4. Reglas de negocio:
-Stock no puede quedar negativo.
-Hi5storial de quién, cuándo y qué movió.
5. Objetivo técnico:
-Evaluar validaciones numéricas, trazabilidad y relaciones múltiples.


# Sistema de Inventario con Auditoría

## Uso Básico

1. Obtener producto por ID
##javascript
const { getProductoById } = require('./backend/repository');

getProductoById('5f8d3b5b3f6d8a1b9c7d3e5f')
.then(producto => console.log('Producto encontrado:', producto))
.catch(error => console.error('Error:', error.message));


#Para crear Producto
const { crearMovimiento } = require('./backend/repository');

crearMovimiento(
  '5f8d3b5b3f6d8a1b9c7d3e5f',
  'usuario123',               
  'entrada',                  
  10                          
)
  .then(movimiento => console.log('Movimiento creado:', movimiento))
  .catch(error => console.error('Error:', error.message));
