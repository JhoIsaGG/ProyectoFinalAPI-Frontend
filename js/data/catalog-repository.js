/* Repositorio Genérico para Catálogos */
import { apiClient } from '../core/api-client.js';

const ENDPOINTS = {
    roles: '/roles',
    departamentos: '/departamentos',
    categorias: '/categorias_ticket',
    estados: '/estados-ticket',
    prioridades: '/prioridades-ticket'
};

export const catalogRepository = {
    async getAll(catalogType) {
        const endpoint = ENDPOINTS[catalogType];
        if (!endpoint) throw new Error(`Catálogo no soportado: ${catalogType}`);
        const response = await apiClient.get(endpoint);
        return response.data || [];
    },

    async getById(catalogType, id) {
        const endpoint = ENDPOINTS[catalogType];
        if (!endpoint) throw new Error(`Catálogo no soportado: ${catalogType}`);
        const response = await apiClient.get(`${endpoint}/${id}`);
        return response.data || null;
    },

    async create(catalogType, data) {
        const endpoint = ENDPOINTS[catalogType];
        if (!endpoint) throw new Error(`Catálogo no soportado: ${catalogType}`);
        const response = await apiClient.post(endpoint, data);
        return response.data || null;
    },

    async update(catalogType, id, data) {
        const endpoint = ENDPOINTS[catalogType];
        if (!endpoint) throw new Error(`Catálogo no soportado: ${catalogType}`);
        const response = await apiClient.put(`${endpoint}/${id}`, data);
        return response.data || null;
    },

    async delete(catalogType, id, updatedBy) {
        const endpoint = ENDPOINTS[catalogType];
        if (!endpoint) throw new Error(`Catálogo no soportado: ${catalogType}`);
        const response = await apiClient.delete(`${endpoint}/${id}`, { updated_by: updatedBy });
        return response.success;
    }
};
