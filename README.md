# InventTrack
En este repositorio haremos un proyecto sobre sistema de inventario con auditoria de movimiento o eso espero.
#Descripción:
-Sistema para registrar movimientos de inventario con historial y validaciones.
#Requerimientos funcionales:
-CRUD de productos y movimientos.
-Registro del usuario que ejecuta cada movimiento.
-Consulta del historial por producto.
#Base de datos sugerida:
-Productos(id, nombre, stock_inicial)
-Movimientos(id, producto_id, usuario_id, tipo, cantidad, fecha)
#Reglas de negocio:
-Stock no puede quedar negativo.
-Historial de quién, cuándo y qué movió.
#Objetivo técnico:
-Evaluar validaciones numéricas, trazabilidad y relaciones múltiples.
