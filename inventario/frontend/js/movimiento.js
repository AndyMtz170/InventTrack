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
            
            if (!productoId) {
                alert('Por favor seleccione un producto');
                return;
            }
            
            if (isNaN(cantidad) || cantidad <= 0) {
                alert('La cantidad debe ser un número positivo');
                cantidadInput.focus();
                return;
            }
            
            try {
                const response = await fetch('http://localhost:3000/api/movimientos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        producto_id: productoId,
                        tipo, 
                        cantidad
                    })
                });
                
                const responseData = await response.json();
                
                if (!response.ok) {
                    // Mostrar mensaje detallado del servidor
                    throw new Error(responseData.error || 'Error al registrar movimiento');
                }
                
                alert('Movimiento registrado exitosamente!');
                movimientoForm.reset();
                cargarProductosEnSelect();
                
                if (typeof window.cargarProductos === 'function') {
                    window.cargarProductos();
                }
                
                if (typeof window.cargarHistorico === 'function') {
                    const historicoSection = document.getElementById('historico-section');
                    if (historicoSection.style.display === 'block') {
                        window.cargarHistorico();
                    }
                }
                
            } catch (error) {
                alert('Error: ' + error.message);
                console.error('Detalles del error:', error);
            }
        });
    }
    
    async function cargarProductosEnSelect() {
        try {
            const response = await fetch('http://localhost:3000/api/productos', {
                headers: {
                    'Authorization': `Bearer ${token}`
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
            
            selectProducto.addEventListener('change', () => {
                const selectedOption = selectProducto.options[selectProducto.selectedIndex];
                const stock = selectedOption ? selectedOption.dataset.stock : 0;
                document.getElementById('stock-info').textContent = `Stock actual: ${stock}`;
            });
            
        } catch (error) {
            console.error('Error al cargar productos:', error);
            selectProducto.innerHTML = '<option value="">Error al cargar productos</option>';
        }
    }
    
    const stockInfo = document.createElement('div');
    stockInfo.id = 'stock-info';
    stockInfo.style.margin = '10px 0';
    stockInfo.style.fontWeight = 'bold';
    movimientoForm.parentNode.insertBefore(stockInfo, movimientoForm.nextSibling);
    
    window.cargarProductosEnSelect = cargarProductosEnSelect;
});