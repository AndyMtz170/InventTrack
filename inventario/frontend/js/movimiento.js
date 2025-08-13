document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const movimientoForm = document.getElementById('movimiento-form');
    const selectProducto = document.getElementById('movimiento-producto');
    
    cargarProductosEnSelect();
    
    if (movimientoForm) {
        movimientoForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const productoId = selectProducto.value;
            const tipo = document.getElementById('movimiento-tipo').value;
            const cantidadInput = document.getElementById('movimiento-cantidad');
            const cantidad = parseInt(cantidadInput.value);
            const usuario = JSON.parse(localStorage.getItem('usuario')); // Obtener usuario del localStorage
            
            if (!productoId) {
                alert('Por favor seleccione un producto');
                return;
            }
            
            if (isNaN(cantidad) || cantidad <= 0) {
                alert('La cantidad debe ser un número positivo');
                cantidadInput.focus();
                return;
            }
            
            if (!usuario || !usuario._id) {
                alert('No se encontró información del usuario. Vuelva a iniciar sesión.');
                return;
            }
            
            try {
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                const response = await fetch('/api/movimientos', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Formato estándar
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        producto: productoId,
                        tipo: tipo, 
                        cantidad: cantidad,
                        usuario: usuario._id
                    })
                });
                
                const responseData = await response.json();
                
                if (!response.ok) {
                    throw new Error(responseData.error || 'Error al registrar movimiento');
                }
                
                alert('Movimiento registrado exitosamente!');
                movimientoForm.reset();
                
                // Recargar productos para actualizar stock
                await cargarProductosEnSelect();
                
                // Actualizar lista de productos
                if (typeof window.cargarProductos === 'function') {
                    window.cargarProductos();
                }
                
                // Actualizar histórico
                if (typeof window.cargarHistorico === 'function') {
                    window.cargarHistorico();
                }
                
            } catch (error) {
                alert('Error: ' + error.message);
                console.error('Detalles del error:', error);
            }
        });
    }
    
    async function cargarProductosEnSelect() {
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
            const selectedValue = selectProducto.value;
            
            selectProducto.innerHTML = '<option value="">Seleccione un producto</option>';
            
            productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto._id;
                option.textContent = producto.nombre;
                option.dataset.stock = producto.stock_actual;
                selectProducto.appendChild(option);
            });
            
            if (selectedValue) {
                selectProducto.value = selectedValue;
            }
            
            // Actualizar info de stock
            actualizarInfoStock();
            
        } catch (error) {
            console.error('Error al cargar productos:', error);
            selectProducto.innerHTML = '<option value="">Error al cargar productos</option>';
        }
    }
    
    function actualizarInfoStock() {
        const selectedOption = selectProducto.options[selectProducto.selectedIndex];
        const stock = selectedOption ? selectedOption.dataset.stock : 0;
        document.getElementById('stock-info').textContent = `Stock actual: ${stock}`;
    }
    
    selectProducto.addEventListener('change', actualizarInfoStock);
    
    // Crear elemento para mostrar stock
    let stockInfo = document.getElementById('stock-info');
    if (!stockInfo) {
        stockInfo = document.createElement('div');
        stockInfo.id = 'stock-info';
        stockInfo.className = 'alert alert-info';
        stockInfo.style.margin = '10px 0';
        movimientoForm.parentNode.insertBefore(stockInfo, movimientoForm.nextSibling);
    }
    
    // Actualizar stock inicial
    actualizarInfoStock();
    
    window.cargarProductosEnSelect = cargarProductosEnSelect;
});