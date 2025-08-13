document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Función para mostrar alertas
    const showAlert = (message, type = 'error') => {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.innerHTML = `
                <div class="alert-icon">
                    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                </div>
                <div>${message}</div>
            `;
            alertContainer.appendChild(alert);
            setTimeout(() => alert.remove(), 5000);
        } else {
            alert(`${type.toUpperCase()}: ${message}`);
        }
    };
    
    // Función para obtener datos de localStorage de forma segura
    const getLocalStorage = (key, defaultValue = {}) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error parsing localStorage item "${key}":`, error);
            return defaultValue;
        }
    };
    
    // Manejar login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const usuarioInput = document.getElementById('usuario');
            const passwordInput = document.getElementById('password');
            
            if (!usuarioInput || !passwordInput) {
                showAlert('Error en el formulario: campos no encontrados', 'error');
                return;
            }
            
            const usuario = usuarioInput.value.trim();
            const password = passwordInput.value;
            
            // Validación básica
            if (!usuario || !password) {
                showAlert('Usuario y contraseña son requeridos', 'error');
                return;
            }
            
            try {
                // Paso 1: Autenticación
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, password })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error de autenticación');
                }
                
                const authData = await response.json();
                
                // Guardar token
                localStorage.setItem('token', authData.token);
                
                // Paso 2: Obtener datos completos del usuario
                const userResponse = await fetch('http://localhost:3000/api/auth/usuario', {
                    headers: {
                        'x-auth-token': authData.token
                    }
                });
                
                if (!userResponse.ok) {
                    throw new Error('Error al obtener datos del usuario');
                }
                
                const userData = await userResponse.json();
                
                // Guardar datos completos del usuario
                localStorage.setItem('usuario', JSON.stringify({
                    id: userData.id,
                    nombre: userData.nombre,
                    usuario: userData.usuario,
                    rol: userData.rol
                }));
                
                showAlert('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'inventario.html';
                }, 1500);
                
            } catch (error) {
                console.error('Error en login:', error);
                showAlert(error.message || 'Error en el inicio de sesión', 'error');
            }
        });
    }
    
    // Manejar logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = 'index.html';
        });
    }
    
    // Verificar autenticación en páginas protegidas
    const protectedPages = ['inventario.html', 'historial.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const token = localStorage.getItem('token');
        
        if (!token) {
            showAlert('Debe iniciar sesión primero', 'error');
            setTimeout(() => window.location.href = 'index.html', 2000);
            return;
        }
        
        // Verificar token con el backend
        const verifyToken = async () => {
            try {
                const userResponse = await fetch('http://localhost:3000/api/auth/usuario', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                
                if (userResponse.status === 401) {
                    const errorData = await userResponse.json();
                    throw new Error(errorData.error || 'Sesión expirada o inválida');
                }
                
                if (!userResponse.ok) {
                    throw new Error('Error en la verificación de sesión');
                }
                
                const userData = await userResponse.json();
                
                // Guardar/actualizar datos de usuario
                localStorage.setItem('usuario', JSON.stringify({
                    ...getLocalStorage('usuario', {}),
                    ...userData
                }));
                
                // Mostrar nombre de usuario
                const userElement = document.getElementById('user-info');
                if (userElement) {
                    const usuario = getLocalStorage('usuario');
                    if (usuario && usuario.nombre) {
                        userElement.textContent = `Bienvenido, ${usuario.nombre}`;
                    }
                }
                
            } catch (error) {
                console.error('Error de verificación:', error);
                showAlert('Sesión inválida: ' + error.message, 'error');
                
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.href = 'index.html';
                }, 3000);
            }
        };
        
        verifyToken();
    }
    
    // Mostrar nombre de usuario en todas las páginas
    const usuario = getLocalStorage('usuario');
    const userElement = document.getElementById('user-info');
    if (userElement && usuario && usuario.nombre) {
        userElement.textContent = `Bienvenido, ${usuario.nombre}`;
    }
});