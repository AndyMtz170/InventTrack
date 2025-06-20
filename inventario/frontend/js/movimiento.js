// frontend/js/movimiento.js
document.addEventListener('DOMContentLoaded', () => {
    const movimientoModal = document.getElementById('movimiento-modal');
    const movimientoForm = document.getElementById('movimiento-form');
    const nuevoMovimientoBtn = document.getElementById('nuevo-movimiento-btn');
    const closeMovimientoModal = document.querySelectorAll('.close')[1];
    
    // Abrir modal para nuevo movimiento
    nuevoMovimientoBtn.addEventListener('click', async () => {
        await cargarProductosEnSelect();
        movimientoForm.reset();
        movimientoModal.style.display = 'block';
    });
    
    // Cerrar modal
    closeMovimientoModal.addEventListener('click', () => {
        movimientoModal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === movimientoModal) {
            movimientoModal.style.display = 'none';
        }
    });
    
    // Cargar lista de movimientos
    cargarMovimientos();
    
    // Manejar envío del formulario de movimiento
    movimientoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const movimientoData = {
            producto_id: document.getElementById('movimiento-producto').value,
            usuario_id: '123', // ID del usuario simulado
            tipo: document.getElementById('movimiento-tipo').value,
            cantidad: parseInt(document.getElementById('movimiento-cantidad').value),
            descripcion: document.getElementById('movimiento-descripcion').value
        };
        
        try {
            const response = await fetch('http://localhost:3000/api/movimientos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movimientoData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al registrar el movimiento');
            }
            
            movimientoModal.style.display = 'none';
            cargarMovimientos();
            
            // Actualizar también la lista de productos y el histórico
            cargarProductosEnSelect();
            if (document.getElementById('historico-section').classList.contains('active')) {
                cargarHistorico();
            }
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Función para cargar productos en el select
    async function cargarProductosEnSelect() {
        try {
            const response = await fetch('http://localhost:3000/api/productos');
            const productos = await response.json();
            
            const select = document.getElementById('movimiento-producto');
            select.innerHTML = '';
            
            productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto._id;
                option.textContent = `${producto.nombre} (Stock: ${producto.stock_actual})`;
                select.appendChild(option);
            });
            
            // También actualizar el select del filtro en el histórico
            const filterSelect = document.getElementById('filter-producto');
            filterSelect.innerHTML = '<option value="">Todos los productos</option>';
            
            productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto._id;
                option.textContent = producto.nombre;
                filterSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }
    
    // Función para cargar la lista de movimientos
    async function cargarMovimientos() {
        try {
            const response = await fetch('http://localhost:3000/api/movimientos');
            const movimientos = await response.json();
            
            const movimientosList = document.getElementById('movimientos-list');
            movimientosList.innerHTML = '';
            
            if (movimientos.length === 0) {
                movimientosList.innerHTML = '<p>No hay movimientos registrados.</p>';
                return;
            }
            
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            
            const tbody = table.querySelector('tbody');
            
            movimientos.forEach(movimiento => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${movimiento.producto_id?.nombre || 'Producto eliminado'}</td>
                    <td class="${movimiento.tipo === 'entrada' ? 'movimiento-entrada' : 'movimiento-salida'}">
                        ${movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                    </td>
                    <td>${movimiento.cantidad}</td>
                    <td>${new Date(movimiento.fecha).toLocaleString()}</td>
                    <td>${movimiento.usuario_id?.nombre || 'Usuario eliminado'}</td>
                `;
                
                tbody.appendChild(row);
            });
            
            movimientosList.appendChild(table);
        } catch (error) {
            console.error('Error al cargar movimientos:', error);
            document.getElementById('movimientos-list').innerHTML = '<p>Error al cargar los movimientos.</p>';
        }
    }
});