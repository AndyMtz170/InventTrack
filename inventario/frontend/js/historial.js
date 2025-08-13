document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes iniciar sesión para ver el historial');
        window.location.href = 'index.html';
        return;
    }

    const filterProducto = document.getElementById('filter-producto');
    const historicoList = document.getElementById('historico-list');
    
    await cargarProductosParaFiltro();
    await cargarHistorico();
    
    if (filterProducto) {
        filterProducto.addEventListener('change', cargarHistorico);
    }
    
    async function cargarProductosParaFiltro() {
        try {
            const response = await fetch('/api/productos', {
                headers: { 
                    'x-auth-token': token
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            
            const productos = await response.json();
            
            // Guardar selección actual
            const currentSelection = filterProducto.value;
            
            // Limpiar y agregar opciones
            filterProducto.innerHTML = '<option value="">Todos los productos</option>';
            
            productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto._id;
                option.textContent = producto.nombre;
                filterProducto.appendChild(option);
            });
            
            // Restaurar selección si existe
            if (currentSelection) {
                filterProducto.value = currentSelection;
            }
            
        } catch (error) {
            console.error('Error al cargar productos para filtro:', error);
            historicoList.innerHTML = `<div class="alert alert-danger">Error al cargar productos: ${error.message}</div>`;
        }
    }
    
    async function cargarHistorico() {
        // Mostrar indicador de carga
        historicoList.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>';
        
        const productoId = filterProducto ? filterProducto.value : '';
        
        try {
            let url = '/api/movimientos';
            if (productoId) {
                url = `/api/movimientos/${productoId}/historial`;
            }
            
            const response = await fetch(url, {
                headers: { 
                    'x-auth-token': token
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al cargar histórico');
            }
            
            const movimientos = await response.json();
            renderizarHistorico(movimientos);
            
        } catch (error) {
            console.error('Error al cargar histórico:', error);
            historicoList.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error!</strong> ${error.message || 'Error desconocido al cargar el histórico'}
                </div>
            `;
        }
    }
    
    function renderizarHistorico(movimientos) {
        historicoList.innerHTML = '';
        
        if (!movimientos || movimientos.length === 0) {
            historicoList.innerHTML = `
                <div class="alert alert-info">
                    No se encontraron movimientos
                </div>
            `;
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'table table-striped';
        table.innerHTML = `
            <thead class="table-dark">
                <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Usuario</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        
        const tbody = table.querySelector('tbody');
        
        movimientos.forEach(movimiento => {
            const fecha = movimiento.createdAt 
                ? new Date(movimiento.createdAt).toLocaleString() 
                : 'Fecha desconocida';
                
            const tipo = movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida';
            const tipoClase = movimiento.tipo === 'entrada' ? 'text-success' : 'text-danger';
            
            const productoNombre = movimiento.producto_id?.nombre || 'Producto eliminado';
            const usuarioNombre = movimiento.usuario_id?.nombre || 'Usuario desconocido';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fecha}</td>
                <td>${productoNombre}</td>
                <td class="${tipoClase} fw-bold">${tipo}</td>
                <td>${movimiento.cantidad}</td>
                <td>${usuarioNombre}</td>
            `;
            tbody.appendChild(row);
        });
        
        historicoList.appendChild(table);
    }
    
    // Hacer funciones accesibles globalmente
    window.cargarHistorico = cargarHistorico;
    window.cargarProductosParaFiltro = cargarProductosParaFiltro;
});