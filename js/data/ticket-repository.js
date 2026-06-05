/* Repositorio de Tickets */
import { apiClient } from '../core/api-client.js';

export const ticketRepository = {
    async getAll(filters = {}) {
        const response = await apiClient.get('/tickets', filters);
        return response.data || [];
    },

    async getById(id) {
        const response = await apiClient.get(`/tickets/${id}`);
        return response.data || null;
    },

    async create(ticketData) {
        // Estructura requerida: titulo, descripcion, estado_ticket_id, prioridad_ticket_id, categoria_ticket_id, created_by
        const response = await apiClient.post('/tickets', ticketData);
        return response.data || null;
    },

    async update(id, ticketData) {
        const response = await apiClient.put(`/tickets/${id}`, ticketData);
        return response.data || null;
    },

    async delete(id, updatedBy) {
        const response = await apiClient.delete(`/tickets/${id}`, { updated_by: updatedBy });
        return response.success;
    },

    async getComments(ticketId) {
        const response = await apiClient.get(`/tickets/${ticketId}/comentarios`);
        return response.data || [];
    },

    async addComment(ticketId, commentData) {
        // Estructura: ticket_id, usuario_id, descripcion, created_by
        const response = await apiClient.post(`/tickets/${ticketId}/comentarios`, {
            ticket_id: ticketId,
            ...commentData
        });
        return response.data || null;
    }
};
