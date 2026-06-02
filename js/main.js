import { apiClient } from './api/client.js';
import { 
    renderStats, 
    renderTable, 
    openFormModal, 
    closeFormModal, 
    showToast, 
    toggleLoader 
} from './dom/render.js';
import { serializeForm } from './utils/helpers.js';

// Estado global de la aplicación
const AppState = {
    activeResource: 'usuarios', // Recurso por defecto
    editingId: null,            // ID del registro que se está editando
    data: {
        usuarios: [],
        roles: [],
        departamentos: []
    }
};

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', async () => {
    setupNavbarListeners();
    setupModalListeners();
    setupCRUDListeners();
    
    // Carga de datos inicial
    await refreshAllData();
});

/**
 * Registra los escuchadores para el Navbar Superior (Navegación)
 */
function setupNavbarListeners() {
    const navbarItems = document.querySelectorAll('.navbar-item');
    navbarItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Remover estado activo previo
            navbarItems.forEach(i => i.classList.remove('active'));
            
            // Activar item seleccionado
            item.classList.add('active');
            
            // Actualizar recurso activo y recargar vista
            const resource = item.getAttribute('data-resource');
            AppState.activeResource = resource;
            
            toggleLoader(true);
            try {
                await fetchResourceData(resource);
                updateUI();
            } catch (err) {
                showToast(`Error al cambiar a ${resource}: ${err.message}`, 'error');
            }
        });
    });
}

/**
 * Registra los escuchadores de los botones del Modal
 */
function setupModalListeners() {
    const btnClose = document.getElementById('btn-modal-close');
    const btnCancel = document.getElementById('btn-modal-cancel');
    const btnSave = document.getElementById('btn-modal-save');
    const modalOverlay = document.getElementById('modal-overlay');

    btnClose.addEventListener('click', closeFormModal);
    btnCancel.addEventListener('click', closeFormModal);
    
    // Al dar clic en "Guardar", se dispara el submit del formulario interno
    btnSave.addEventListener('click', () => {
        const form = document.getElementById('crud-form');
        if (form) {
            // Activa las validaciones nativas de HTML5 (required, email, etc.)
            form.querySelector('button[type="submit"]').click();
        }
    });

    // Cerrar al hacer clic fuera del contenido del modal
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeFormModal();
        }
    });
}

/**
 * Registra escuchadores globales para las acciones CRUD utilizando delegación de eventos
 */
function setupCRUDListeners() {
    const appContent = document.getElementById('app-content');

    // 1. Delegar clic en botón "Crear"
    appContent.addEventListener('click', (e) => {
        const trigger = e.target.closest('#btn-create-trigger');
        if (trigger) {
            AppState.editingId = null; // Modo Creación
            
            // Si vamos a crear un usuario, validar que tengamos roles y departamentos
            if (AppState.activeResource === 'usuarios') {
                if (AppState.data.roles.length === 0 || AppState.data.departamentos.length === 0) {
                    showToast('Crea al menos un Rol y un Departamento antes de registrar usuarios.', 'error');
                    return;
                }
            }

            openFormModal(
                AppState.activeResource, 
                'create', 
                null, 
                { roles: AppState.data.roles, departamentos: AppState.data.departamentos }
            );
            setupFormSubmitListener();
        }
    });

    // 2. Delegar clic en botón "Editar"
    appContent.addEventListener('click', async (e) => {
        const editBtn = e.target.closest('.btn-edit-row');
        if (editBtn) {
            const id = parseInt(editBtn.getAttribute('data-id'), 10);
            AppState.editingId = id;
            
            const currentItem = AppState.data[AppState.activeResource].find(item => item.id === id);
            if (currentItem) {
                openFormModal(
                    AppState.activeResource, 
                    'edit', 
                    currentItem, 
                    { roles: AppState.data.roles, departamentos: AppState.data.departamentos }
                );
                setupFormSubmitListener();
            } else {
                showToast('No se encontró el registro seleccionado localmente.', 'error');
            }
        }
    });

    // 3. Delegar clic en botón "Eliminar"
    appContent.addEventListener('click', async (e) => {
        const deleteBtn = e.target.closest('.btn-delete-row');
        if (deleteBtn) {
            const id = parseInt(deleteBtn.getAttribute('data-id'), 10);
            
            const confirmMsg = `¿Estás seguro de que deseas desactivar (Soft Delete) este registro con ID #${id}?`;
            if (window.confirm(confirmMsg)) {
                try {
                    toggleLoader(true);
                    // Pasamos updated_by = 1 por defecto para auditoría del soft delete
                    await apiClient.delete(AppState.activeResource, id, 1);
                    showToast('Registro desactivado correctamente.');
                    
                    // Recargar datos y refrescar la interfaz
                    await refreshAllData();
                } catch (err) {
                    showToast(`Error al desactivar: ${err.message}`, 'error');
                    updateUI(); // Restaurar UI
                }
            }
        }
    });
}

/**
 * Escucha el evento de submit del formulario inyectado dinámicamente en el modal
 */
function setupFormSubmitListener() {
    const form = document.getElementById('crud-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = serializeForm(form);
        const resource = AppState.activeResource;
        
        try {
            closeFormModal();
            toggleLoader(true);

            if (AppState.editingId === null) {
                // Modo Creación: POST
                await apiClient.create(resource, formData);
                showToast('Registro creado exitosamente.');
            } else {
                // Modo Edición: PUT
                await apiClient.update(resource, AppState.editingId, formData);
                showToast('Registro actualizado exitosamente.');
            }

            // Recargar datos y actualizar UI
            await refreshAllData();
        } catch (err) {
            showToast(`Error al guardar: ${err.message}`, 'error');
            // Reabrir modal con los datos previamente llenados para no perder el progreso del usuario
            openFormModal(
                resource, 
                AppState.editingId === null ? 'create' : 'edit', 
                formData, 
                { roles: AppState.data.roles, departamentos: AppState.data.departamentos }
            );
            setupFormSubmitListener();
        }
    });
}

/**
 * Carga la información de un recurso específico desde la API al estado de la aplicación.
 * @param {string} resource 
 */
async function fetchResourceData(resource) {
    AppState.data[resource] = await apiClient.getAll(resource);
}

/**
 * Recarga todos los recursos en paralelo para mantener las llaves foráneas y estadísticas consistentes.
 */
async function refreshAllData() {
    toggleLoader(true);
    try {
        // Ejecutar peticiones en paralelo para optimizar la velocidad de carga
        await Promise.all([
            fetchResourceData('usuarios'),
            fetchResourceData('roles'),
            fetchResourceData('departamentos')
        ]);
        
        updateUI();
    } catch (err) {
        showToast(`Error de conexión con la API: ${err.message}`, 'error');
        // Renderiza tabla vacía en caso de fallas de la API para permitir visualizar la interfaz
        updateUI();
    }
}

/**
 * Refresca la interfaz de usuario con los datos actualmente almacenados en el estado de la aplicación
 */
function updateUI() {
    // 1. Renderizar Estadísticas
    const counts = {
        usuarios: AppState.data.usuarios.length,
        // Contar cuántos roles están activos
        roles: AppState.data.roles.filter(r => r.estado == 1).length,
        // Contar cuántos departamentos están activos
        departamentos: AppState.data.departamentos.filter(d => d.estado == 1).length
    };
    renderStats(counts);

    // 2. Renderizar Tabla Activa
    renderTable(
        AppState.activeResource, 
        AppState.data[AppState.activeResource], 
        { roles: AppState.data.roles, departamentos: AppState.data.departamentos }
    );
}
