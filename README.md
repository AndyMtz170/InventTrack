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
-Historial de quién, cuándo y qué movió.
5. Objetivo técnico:
-Evaluar validaciones numéricas, trazabilidad y relaciones múltiples.
