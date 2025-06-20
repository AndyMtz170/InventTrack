// frontend/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    // Simulación de autenticación
    const userInfo = {
        id: '123',
        nombre: 'Admin',
        email: 'admin@inventario.com'
    };
    
    document.getElementById('username').textContent = `Usuario: ${userInfo.nombre}`;
    
    // Cerrar sesión
    document.getElementById('logout-btn').addEventListener('click', () => {
        window.location.reload();
    });
    
    // Navegación entre secciones
    document.getElementById('nav-productos').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('productos-section');
    });
    
    document.getElementById('nav-movimientos').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('movimientos-section');
    });
    
    document.getElementById('nav-historico').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('historico-section');
    });
    
    function showSection(sectionId) {
        document.querySelectorAll('main section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }
    
    // Mostrar sección de productos por defecto
    showSection('productos-section');
});