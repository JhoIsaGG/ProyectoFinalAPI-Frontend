/* Configuración del Frontend */

// Mapea la dirección del servidor API de forma dinámica relativa al origen actual,
// o usa localhost si se abre directamente por archivo (file://)
const getBaseUrl = () => {
    if (window.location.protocol === 'file:') {
        return 'http://192.168.137.20/api';
    }
    return `${window.location.origin}/api`;
};

export const CONFIG = {
    API_BASE_URL: getBaseUrl(),
    AUTH_TOKEN: 'QuesitrixSecretSociety',
    SESSION_KEY: 'mesa_ayuda_user_session'
};
