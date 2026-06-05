/* Repositorio de Usuarios */
import { apiClient } from '../core/api-client.js';

export const userRepository = {
    async getAll() {
        const response = await apiClient.get('/usuarios');
        return response.data || [];
    },

    async getById(id) {
        const response = await apiClient.get(`/usuarios/${id}`);
        return response.data || null;
    },

    async create(userData) {
        const response = await apiClient.post('/usuarios', userData);
        return response.data || null;
    },

    async update(id, userData) {
        const response = await apiClient.put(`/usuarios/${id}`, userData);
        return response.data || null;
    },

    async delete(id, updatedBy) {
        const response = await apiClient.delete(`/usuarios/${id}`, { updated_by: updatedBy });
        return response.success;
    }
};
