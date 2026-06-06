/* Repositorio de Autenticación */
import { apiClient } from '../core/api-client.js';
import { CONFIG } from '../core/config.js';

export const authRepository = {
    async login(email, password) {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.success && response.data) {
            localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(response.data));
            return response.data;
        }
        return null;
    },

    async resetPassword(email, newPassword, updatedBy) {
        return await apiClient.post('/auth/restablecer-contrasena', {
            email,
            password: newPassword,
            updated_by: updatedBy
        });
    },

    logout() {
        localStorage.removeItem(CONFIG.SESSION_KEY);
        window.location.href = '/Proyectofinal/views/login.html';
    },

    getCurrentUser() {
        const session = localStorage.getItem(CONFIG.SESSION_KEY);
        if (!session) return null;
        try {
            return JSON.parse(session);
        } catch (e) {
            return null;
        }
    },

    isAuthenticated() {
        return this.getCurrentUser() !== null;
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return user && Number(user.rol_id) === 1;
    },

    checkAuthOrRedirect() {
        if (!this.isAuthenticated()) {
            // Si no está autenticado, redirigir a login
            // Obtener ruta relativa correcta del login
            const currentPath = window.location.pathname;
            if (!currentPath.endsWith('login.html')) {
                window.location.href = '/Proyectofinal/views/login.html';
            }
        }
    }
};
