// Función global de logout
function logout() {
    // Eliminar el usuario actual del almacenamiento local
    localStorage.removeItem('currentUser');
    
    // Redirigir a la página principal
    window.location.href = 'index.html';
}

// Objeto para manejar usuarios
const userManager = {
    users: JSON.parse(localStorage.getItem('users')) || [],

    // Registrar un nuevo usuario
    register: function(username, password) {
        const existingUser = this.users.find(user => user.username === username);
        if (existingUser) {
            this.showAlert('El nombre de usuario ya existe', 'danger');
            return false;
        }
        this.users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(this.users));
        this.showAlert('Registro exitoso', 'success');
        return true;
    },

    // Iniciar sesión
    login: function(username, password) {
        if (!username || !password) {
            this.showAlert('Por favor, ingrese usuario y contraseña', 'warning');
            return false;
        }

        const user = this.users.find(user => 
            user.username === username && user.password === password
        );
        
        if (user) {
            localStorage.setItem('currentUser', username);
            this.showAlert('Inicio de sesión exitoso', 'success');
            // Redirigir después de un breve momento para mostrar la alerta
            setTimeout(() => {
                window.location.href = 'logged_home.html';
            }, 1500);
            return true;
        } else {
            this.showAlert('Credenciales incorrectas', 'danger');
            return false;
        }
    },

    // Mostrar alertas
    showAlert: function(message, type) {
        // Eliminar alertas previas
        const existingAlerts = document.querySelectorAll('.custom-alert');
        existingAlerts.forEach(alert => alert.remove());

        // Crear contenedor de alertas si no existe
        let alertContainer = document.getElementById('alert-container');
        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.id = 'alert-container';
            alertContainer.style.position = 'fixed';
            alertContainer.style.top = '20px';
            alertContainer.style.left = '50%';
            alertContainer.style.transform = 'translateX(-50%)';
            alertContainer.style.zIndex = '1050';
            document.body.appendChild(alertContainer);
        }

        // Crear alerta
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} custom-alert alert-dismissible fade show`;
        alert.role = 'alert';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertContainer.appendChild(alert);

        // Eliminar la alerta después de 5 segundos
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    },

    // Verificar si está logueado
    isLoggedIn: function() {
        return localStorage.getItem('currentUser') !== null;
    }
};

// Eventos al cargar el documento
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar nombre de usuario en la página logueada
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        const currentUser = localStorage.getItem('currentUser');
        userNameElement.textContent = currentUser || 'Usuario';
    }

    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('newUsername').value;
            const password = document.getElementById('newPassword').value;
            
            if (userManager.register(username, password)) {
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        });
    }

    // Formulario de inicio de sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            userManager.login(username, password);
        });
    }

    // Modifica esta parte del código
    document.addEventListener('DOMContentLoaded', function() {
    // Protección de rutas
    const currentPath = window.location.pathname;
    
    // Cambia la condición para non_logged_home.html
    if (currentPath.includes('non_logged_home.html')) {
        // Si ya está logueado, redirigir
        if (userManager.isLoggedIn()) {
            window.location.href = 'logged_home.html';
        }
    }
    })
});