// frontend/js/historial.js
document.addEventListener('DOMContentLoaded', () => {
    const filterProducto = document.getElementById('filter-producto');
    
    // Cargar histórico al mostrar la sección
    document.getElementById('nav-historico').addEventListener('click', () => {
        cargarHistorico();
    });
    
    // Filtrar histórico por producto
    filterProducto.addEventListener('change', () => {
        cargarHistorico();
    });
    
    // Función para cargar el histórico
    async function cargarHistorico() {
        const productoId = filterProducto.value;
        let url = 'http://localhost:3000/api/movimientos';
        
        if (productoId) {
            url += `/producto/${productoId}`;
        }
        
        try {
            const response = await fetch(url);
            const movimientos = await response.json();
            
            const historicoList = document.getElementById('historico-list');
            historicoList.innerHTML = '';
            
            if (movimientos.length === 0) {
                historicoList.innerHTML = '<p>No hay movimientos para mostrar.</p>';
                return;
            }
            
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Usuario</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            
            const tbody = table.querySelector('tbody');
            
            movimientos.forEach(movimiento => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(movimiento.fecha).toLocaleString()}</td>
                    <td>${movimiento.producto_id?.nombre || 'Producto eliminado'}</td>
                    <td class="${movimiento.tipo === 'entrada' ? 'movimiento-entrada' : 'movimiento-salida'}">
                        ${movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                    </td>
                    <td>${movimiento.cantidad}</td>
                    <td>${movimiento.usuario_id?.nombre || 'Usuario eliminado'}</td>
                    <td>${movimiento.descripcion || '-'}</td>
                `;
                
                tbody.appendChild(row);
            });
            
            historicoList.appendChild(table);
        } catch (error) {
            console.error('Error al cargar histórico:', error);
            document.getElementById('historico-list').innerHTML = '<p>Error al cargar el histórico.</p>';
        }
    }
});