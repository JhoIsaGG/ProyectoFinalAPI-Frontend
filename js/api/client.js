/**
 * Cliente de API unificado para realizar peticiones HTTP a la API PHP.
 */

const BASE_URL = 'http://localhost/proyectofinalapi/public/api';

const HEADERS = {
    'Authorization': 'QuesitrixSecretSociety',
    'Content-Type': 'application/json'
};

/**
 * Helper interno para procesar la respuesta HTTP.
 * @param {Response} response 
 * @returns {Promise<any>}
 */
async function handleResponse(response) {
    let result;
    try {
        result = await response.json();
    } catch (e) {
        throw new Error('Error al decodificar la respuesta del servidor (No es un JSON válido).');
    }

    if (!response.ok || !result.success) {
        const errorMsg = result.message || `Error del servidor: Código ${response.status}`;
        throw new Error(errorMsg);
    }

    return result;
}

export const apiClient = {
    /**
     * Obtiene una lista de elementos de un recurso (usuarios, roles, departamentos).
     * @param {string} resource 
     * @returns {Promise<Array>}
     */
    async getAll(resource) {
        try {
            const response = await fetch(`${BASE_URL}/${resource}`, {
                method: 'GET',
                headers: HEADERS
            });
            const resData = await handleResponse(response);
            // Si viene envuelto en un objeto con el nombre del recurso, o directamente en data
            return resData.data || [];
        } catch (error) {
            console.error(`Error en GET /${resource}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene un registro único por ID.
     * @param {string} resource 
     * @param {number|string} id 
     * @returns {Promise<Object>}
     */
    async getById(resource, id) {
        try {
            const response = await fetch(`${BASE_URL}/${resource}/${id}`, {
                method: 'GET',
                headers: HEADERS
            });
            const resData = await handleResponse(response);
            return resData.data;
        } catch (error) {
            console.error(`Error en GET /${resource}/${id}:`, error);
            throw error;
        }
    },

    /**
     * Crea un nuevo registro en el recurso especificado.
     * @param {string} resource 
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    async create(resource, data) {
        try {
            const response = await fetch(`${BASE_URL}/${resource}`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify(data)
            });
            const resData = await handleResponse(response);
            return resData.data;
        } catch (error) {
            console.error(`Error en POST /${resource}:`, error);
            throw error;
        }
    },

    /**
     * Actualiza un registro existente por su ID.
     * @param {string} resource 
     * @param {number|string} id 
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    async update(resource, id, data) {
        try {
            const response = await fetch(`${BASE_URL}/${resource}/${id}`, {
                method: 'PUT',
                headers: HEADERS,
                body: JSON.stringify(data)
            });
            const resData = await handleResponse(response);
            return resData.data;
        } catch (error) {
            console.error(`Error en PUT /${resource}/${id}:`, error);
            throw error;
        }
    },

    /**
     * Realiza una inactivación lógica (soft-delete) del registro en la API.
     * Envía la información de auditoría del usuario que realiza la acción en el cuerpo de la petición.
     * @param {string} resource 
     * @param {number|string} id 
     * @param {number} updatedBy ID del usuario que edita/desactiva (1 por defecto).
     * @returns {Promise<Object>}
     */
    async delete(resource, id, updatedBy = 1) {
        try {
            const response = await fetch(`${BASE_URL}/${resource}/${id}`, {
                method: 'DELETE',
                headers: HEADERS,
                body: JSON.stringify({ updated_by: updatedBy })
            });
            const resData = await handleResponse(response);
            return resData.data;
        } catch (error) {
            console.error(`Error en DELETE /${resource}/${id}:`, error);
            throw error;
        }
    }
};
