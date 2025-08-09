document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debe iniciar sesión');
        window.location.href = 'index.html';
        return;
    }

    const productoModal = document.getElementById('producto-modal');
    const productoForm = document.getElementById('producto-form');
    const nuevoProductoBtn = document.getElementById('nuevo-producto-btn');
    const closeProductoModal = document.querySelector('.close');
    const productosList = document.getElementById('productos-list');
    
    // Modal de edición
    const editProductoModal = document.getElementById('edit-producto-modal');
    const editProductoForm = document.getElementById('edit-producto-form');
    const closeEditModal = document.getElementById('close-edit-modal');
    
    // Abrir modal para nuevo producto
    if (nuevoProductoBtn) {
        nuevoProductoBtn.addEventListener('click', () => {
            productoForm.reset();
            productoModal.style.display = 'block';
        });
    }
    
    // Cerrar modales
    const closeModals = () => {
        if (productoModal) productoModal.style.display = 'none';
        if (editProductoModal) editProductoModal.style.display = 'none';
    };
    
    if (closeProductoModal) {
        closeProductoModal.addEventListener('click', closeModals);
    }
    
    if (closeEditModal) {
        closeEditModal.addEventListener('click', closeModals);
    }
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === productoModal || e.target === editProductoModal) {
            closeModals();
        }
    });
    
    // Cargar lista de productos
    cargarProductos();
    
    // Manejar envío del formulario de nuevo producto
    if (productoForm) {
        productoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            
            const productoData = {
                nombre: document.getElementById('producto-nombre').value,
                stock_inicial: parseInt(document.getElementById('producto-stock').value),
                creado_por: usuario ? usuario.nombre : 'Usuario'
            };
            
            try {
                const response = await fetch('http://localhost:3000/api/productos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(productoData)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al crear el producto');
                }
                
                const newProduct = await response.json();
                closeModals();
                cargarProductos();
            } catch (error) {
                alert(`Error: ${error.message}`);
                console.error('Detalles del error:', error);
            }
        });
    }
    
    // Manejar envío del formulario de edición
    if (editProductoForm) {
        editProductoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('edit-producto-id').value;
            const productoData = {
                nombre: document.getElementById('edit-producto-nombre').value,
                stock_inicial: parseInt(document.getElementById('edit-producto-stock').value)
            };
            
            try {
                const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(productoData)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al actualizar el producto');
                }
                
                const updatedProduct = await response.json();
                closeModals();
                cargarProductos();
            } catch (error) {
                alert(`Error: ${error.message}`);
                console.error('Detalles del error:', error);
            }
        });
    }
    
    // Función para cargar la lista de productos
    async function cargarProductos() {
        try {
            const response = await fetch('http://localhost:3000/api/productos', {
                headers: {
                    'x-auth-token': token
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const productos = await response.json();
            renderizarProductos(productos);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            if (productosList) {
                productosList.innerHTML = `
                    <div class="alert alert-danger">
                        <p>Error al cargar los productos</p>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }
    }
    
    // Función para renderizar productos en tabla
    function renderizarProductos(productos) {
        if (!productosList) return;
        
        productosList.innerHTML = '';
        
        if (productos.length === 0) {
            productosList.innerHTML = '<p class="no-products">No hay productos registrados.</p>';
            return;
        }
        
        // Crear tabla
        const table = document.createElement('table');
        table.className = 'product-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Stock Inicial</th>
                    <th>Stock Actual</th>
                    <th>Creado Por</th>
                    <th>Última Actualización</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        
        const tbody = table.querySelector('tbody');
        
        productos.forEach(producto => {
            const fechaActualizacion = new Date(producto.updatedAt).toLocaleDateString();
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.stock_inicial}</td>
                <td>${producto.stock_actual}</td>
                <td>${producto.creado_por || 'N/A'}</td>
                <td>${fechaActualizacion}</td>
                <td class="action-buttons">
                    <button class="action-btn edit-btn" data-id="${producto._id}">Editar</button>
                    <button class="action-btn delete-btn" data-id="${producto._id}">Eliminar</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        productosList.appendChild(table);
        
        // Agregar event listeners para los botones
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                try {
                    const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
                        headers: {
                            'x-auth-token': token
                        }
                    });
                    
                    if (!response.ok) throw new Error('Error al cargar producto');
                    
                    const producto = await response.json();
                    
                    // Llenar formulario de edición
                    document.getElementById('edit-producto-id').value = producto._id;
                    document.getElementById('edit-producto-nombre').value = producto.nombre;
                    document.getElementById('edit-producto-stock').value = producto.stock_inicial;
                    
                    // Mostrar modal de edición
                    if (editProductoModal) {
                        editProductoModal.style.display = 'block';
                    }
                } catch (error) {
                    alert(`Error: ${error.message}`);
                }
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (confirm('¿Estás seguro de eliminar este producto?')) {
                    try {
                        const response = await fetch(`http://localhost:3000/api/productos/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'x-auth-token': token
                            }
                        });
                        
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || 'Error al eliminar');
                        }
                        
                        cargarProductos();
                    } catch (error) {
                        alert(`Error: ${error.message}`);
                    }
                }
            });
        });
    }
});