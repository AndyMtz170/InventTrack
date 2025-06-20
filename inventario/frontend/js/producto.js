// frontend/js/producto.js
document.addEventListener('DOMContentLoaded', () => {
    const productoModal = document.getElementById('producto-modal');
    const productoForm = document.getElementById('producto-form');
    const nuevoProductoBtn = document.getElementById('nuevo-producto-btn');
    const closeModal = document.querySelector('.close');
    
    // Abrir modal para nuevo producto
    nuevoProductoBtn.addEventListener('click', () => {
        document.getElementById('modal-producto-title').textContent = 'Nuevo Producto';
        productoForm.reset();
        document.getElementById('producto-id').value = '';
        productoModal.style.display = 'block';
    });
    
    // Cerrar modal
    closeModal.addEventListener('click', () => {
        productoModal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === productoModal) {
            productoModal.style.display = 'none';
        }
    });
    
    // Cargar lista de productos
    cargarProductos();
    
    // Manejar envío del formulario
    productoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const productoId = document.getElementById('producto-id').value;
        const productoData = {
            nombre: document.getElementById('producto-nombre').value,
            stock_inicial: parseInt(document.getElementById('producto-stock').value),
            creado_por: '123' // ID del usuario simulado
        };
        
        try {
            let response;
            if (productoId) {
                // Actualizar producto existente
                response = await fetch(`http://localhost:3000/api/productos/${productoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productoData)
                });
            } else {
                // Crear nuevo producto
                response = await fetch('http://localhost:3000/api/productos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productoData)
                });
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al guardar el producto');
            }
            
            productoModal.style.display = 'none';
            cargarProductos();
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Función para cargar la lista de productos
    async function cargarProductos() {
        try {
            const response = await fetch('http://localhost:3000/api/productos');
            const productos = await response.json();
            
            const productosList = document.getElementById('productos-list');
            productosList.innerHTML = '';
            
            if (productos.length === 0) {
                productosList.innerHTML = '<p>No hay productos registrados.</p>';
                return;
            }
            
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Stock Inicial</th>
                        <th>Stock Actual</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            
            const tbody = table.querySelector('tbody');
            
            productos.forEach(producto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.stock_inicial}</td>
                    <td>${producto.stock_actual}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${producto._id}">Editar</button>
                        <button class="delete-btn" data-id="${producto._id}">Eliminar</button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            productosList.appendChild(table);
            
            // Agregar eventos a los botones de editar y eliminar
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => editarProducto(btn.dataset.id));
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => eliminarProducto(btn.dataset.id));
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
            document.getElementById('productos-list').innerHTML = '<p>Error al cargar los productos.</p>';
        }
    }
    
    // Función para editar producto
    async function editarProducto(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/productos/${id}`);
            const producto = await response.json();
            
            if (!response.ok) {
                throw new Error(producto.error || 'Error al cargar el producto');
            }
            
            document.getElementById('modal-producto-title').textContent = 'Editar Producto';
            document.getElementById('producto-id').value = producto._id;
            document.getElementById('producto-nombre').value = producto.nombre;
            document.getElementById('producto-stock').value = producto.stock_inicial;
            
            productoModal.style.display = 'block';
        } catch (error) {
            alert(error.message);
        }
    }
    
    // Función para eliminar producto
    async function eliminarProducto(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar el producto');
            }
            
            cargarProductos();
        } catch (error) {
            alert(error.message);
        }
    }
});