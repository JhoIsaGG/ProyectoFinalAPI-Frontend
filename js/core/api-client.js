/* Cliente API - Envoltorio de fetch */
import { CONFIG } from './config.js';

export const apiClient = {
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;
        
        // Cabeceras por defecto
        const headers = {
            'Authorization': CONFIG.AUTH_TOKEN,
            ...options.headers
        };
        
        if (options.body && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(options.body);
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            
            // Si el código de estado es 204 (No Content), devolver éxito simple
            if (response.status === 204) {
                return { success: true };
            }

            const result = await response.json();

            if (!response.ok || result.success === false) {
                const errorMessage = result.message || `Error en la petición (Código: ${response.status})`;
                const error = new Error(errorMessage);
                error.errors = result.errors || null;
                error.status = response.status;
                throw error;
            }

            return result;
        } catch (error) {
            console.error(`API Error on ${url}:`, error);
            throw error;
        }
    },

    get(endpoint, queryParams = null) {
        let path = endpoint;
        if (queryParams) {
            const cleanParams = {};
            // Filtrar parámetros vacíos
            Object.keys(queryParams).forEach(key => {
                if (queryParams[key] !== null && queryParams[key] !== undefined && queryParams[key] !== '') {
                    cleanParams[key] = queryParams[key];
                }
            });
            const searchParams = new URLSearchParams(cleanParams);
            const queryStr = searchParams.toString();
            if (queryStr) {
                path += `?${queryStr}`;
            }
        }
        return this.request(path, { method: 'GET' });
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        });
    },

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    },

    delete(endpoint, data = null) {
        const options = { method: 'DELETE' };
        if (data) {
            options.body = data;
        }
        return this.request(endpoint, options);
    }
};
