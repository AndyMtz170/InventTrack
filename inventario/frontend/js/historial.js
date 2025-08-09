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
            const response = await fetch('http://localhost:3000/api/productos', {
                headers: { 
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
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
        historicoList.innerHTML = '<div class="loading">Cargando historial...</div>';
        
        const productoId = filterProducto ? filterProducto.value : '';
        
        try {
            let url = 'http://localhost:3000/api/movimientos';
            if (productoId) {
                url = `http://localhost:3000/api/movimientos/${productoId}/historial`;
            }
            
            const response = await fetch(url, {
                headers: { 
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
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
            historicoList.innerHTML = `<div class="alert alert-danger">Error al cargar histórico: ${error.message}</div>`;
        }
    }
    
    function renderizarHistorico(movimientos) {
        historicoList.innerHTML = '';
        
        if (!movimientos || movimientos.length === 0) {
            historicoList.innerHTML = '<p class="no-data">No hay movimientos para mostrar.</p>';
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'historial-table';
        table.innerHTML = `
            <thead>
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
            const fecha = new Date(movimiento.createdAt).toLocaleString();
            const tipo = movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida';
            const productoNombre = movimiento.producto_id?.nombre || 'Producto eliminado';
            const usuarioNombre = movimiento.usuario_id?.nombre || 'Usuario desconocido';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fecha}</td>
                <td>${productoNombre}</td>
                <td class="${tipo.toLowerCase()}">${tipo}</td>
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