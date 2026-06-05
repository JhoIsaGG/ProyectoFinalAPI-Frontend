/* Controlador de la página de Login */
import { authRepository } from '../../../js/data/auth-repository.js';

document.addEventListener('DOMContentLoaded', () => {
    // Si ya está autenticado, redirigir directo al dashboard
    if (authRepository.isAuthenticated()) {
        window.location.href = './dashboard.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const alertError = document.getElementById('alert-error');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        alertError.style.display = 'none';

        try {
            const user = await authRepository.login(email, password);
            if (user) {
                window.location.href = './dashboard.html';
            } else {
                showError('Credenciales incorrectas.');
            }
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            showError(error.message || 'Error de conexión con el servidor de la API.');
        }
    });

    function showError(message) {
        alertError.innerText = message;
        alertError.style.display = 'block';
    }
});
