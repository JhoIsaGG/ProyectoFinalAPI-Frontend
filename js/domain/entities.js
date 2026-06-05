/* Reglas de Negocio / Entidades y Formateadores */

export const entities = {
    // Retorna la clase CSS correspondiente según el ID o nombre del estado de ticket
    getEstadoBadgeClass(estadoIdOrNombre) {
        const value = String(estadoIdOrNombre).toLowerCase();
        if (value === '1' || value === 'abierto') {
            return 'badge-success';
        } else if (value === '2' || value === 'en proceso') {
            return 'badge-warning';
        } else if (value === '3' || value === 'resuelto') {
            return 'badge-neutral';
        }
        return 'badge-primary';
    },

    // Retorna el nombre legible del estado por si la consulta devuelve IDs
    getEstadoNombre(estadoId) {
        const id = Number(estadoId);
        if (id === 1) return 'Abierto';
        if (id === 2) return 'En Proceso';
        if (id === 3) return 'Resuelto';
        return 'Desconocido';
    },

    // Retorna la clase CSS correspondiente según el ID o nombre de prioridad de ticket
    getPrioridadBadgeClass(prioridadIdOrNombre) {
        const value = String(prioridadIdOrNombre).toLowerCase();
        if (value === '3' || value === 'alta') {
            return 'badge-danger';
        } else if (value === '2' || value === 'media') {
            return 'badge-warning';
        } else if (value === '1' || value === 'baja') {
            return 'badge-primary';
        }
        return 'badge-neutral';
    },

    // Retorna el nombre de prioridad por ID
    getPrioridadNombre(prioridadId) {
        const id = Number(prioridadId);
        if (id === 1) return 'Baja';
        if (id === 2) return 'Media';
        if (id === 3) return 'Alta';
        return 'Desconocido';
    },

    // Formateador de fecha amigable (DD/MM/AAAA HH:MM)
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString; // Si falla, retorna original
            
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (e) {
            return dateString;
        }
    }
};
