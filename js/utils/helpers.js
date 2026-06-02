/**
 * Archivo de funciones de ayuda (Helpers)
 */

/**
 * Formatea una cadena de fecha (YYYY-MM-DD HH:MM:SS) a un formato local más amigable.
 * @param {string} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString.replace(/-/g, '/')); // Reemplazo para compatibilidad con Safari/iOS
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

/**
 * Escapa los caracteres HTML especiales para evitar ataques XSS al renderizar texto dinámico.
 * @param {string} str 
 * @returns {string}
 */
export function sanitizeHTML(str) {
    if (typeof str !== 'string') return str;
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return str.replace(reg, (match) => map[match]);
}

/**
 * Convierte los campos de un formulario HTML en un objeto de JS plano.
 * Procesa específicamente los checkbox para retornar 1 o 0.
 * @param {HTMLFormElement} formElement 
 * @returns {Object}
 */
export function serializeForm(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Buscar específicamente los checkboxes del formulario que no estén marcados (FormData no los incluye si están unchecked)
    const checkboxes = formElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        data[cb.name] = cb.checked ? 1 : 0;
    });

    // Convertir campos numéricos específicos a enteros si es necesario
    const numericFields = ['rol_id', 'departamento_id', 'estado', 'created_by', 'updated_by'];
    numericFields.forEach(field => {
        if (data[field] !== undefined) {
            data[field] = parseInt(data[field], 10);
        }
    });
    
    return data;
}

/**
 * Valida si un email es sintácticamente correcto.
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}
