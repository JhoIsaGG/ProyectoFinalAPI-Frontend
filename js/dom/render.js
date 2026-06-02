import { formatDate, sanitizeHTML } from '../utils/helpers.js';

// SVG Icons como strings para reutilización y mantener código limpio
const ICONS = {
    usuarios: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>`,
    roles: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`,
    departamentos: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>`,
    empty: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>`,
    success: `<svg xmlns="http://www.w3.org/2000/svg" class="toast-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" class="toast-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`
};

/**
 * Renderiza las tarjetas de estadísticas dinámicas.
 * @param {Object} counts 
 */
export function renderStats(counts) {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">
                ${ICONS.usuarios}
            </div>
            <div class="stat-info">
                <h4>Total Usuarios</h4>
                <p>${counts.usuarios}</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon accent">
                ${ICONS.roles}
            </div>
            <div class="stat-info">
                <h4>Roles Activos</h4>
                <p>${counts.roles}</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon success">
                ${ICONS.departamentos}
            </div>
            <div class="stat-info">
                <h4>Departamentos</h4>
                <p>${counts.departamentos}</p>
            </div>
        </div>
    `;
}

/**
 * Muestra u oculta el spinner de carga.
 * @param {boolean} show 
 */
export function toggleLoader(show) {
    const contentArea = document.getElementById('app-content');
    if (!contentArea) return;

    if (show) {
        contentArea.innerHTML = `
            <div class="spinner-container">
                <div class="spinner"></div>
                <p>Cargando información desde la API...</p>
            </div>
        `;
    }
}

/**
 * Renderiza el listado principal de cada tabla.
 * @param {string} resource ('usuarios' | 'roles' | 'departamentos')
 * @param {Array} listData Datos devueltos por la API
 * @param {Object} relations Datos de roles/departamentos para cruzar IDs en usuarios
 */
export function renderTable(resource, listData = [], relations = {}) {
    const contentArea = document.getElementById('app-content');
    if (!contentArea) return;

    // Capitalizar nombre para títulos
    const title = resource.charAt(0).toUpperCase() + resource.slice(1);

    if (listData.length === 0) {
        contentArea.innerHTML = `
            <div class="table-container">
                <div class="table-header-bar">
                    <h2>Administración de ${title}</h2>
                    <button class="btn btn-primary" id="btn-create-trigger">
                        ${ICONS.plus} Crear ${title.slice(0, -1)}
                    </button>
                </div>
                <div class="empty-state">
                    ${ICONS.empty}
                    <h3>No se encontraron registros</h3>
                    <p>La API de ${resource} no tiene información registrada en este momento.</p>
                </div>
            </div>
        `;
        return;
    }

    // Estructuras de cabeceras por recurso
    let tableHeadersHTML = '';
    let tableRowsHTML = '';

    if (resource === 'usuarios') {
        tableHeadersHTML = `
            <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Departamento</th>
                <th>Estado</th>
                <th>Creado en</th>
                <th>Acciones</th>
            </tr>
        `;

        tableRowsHTML = listData.map(item => {
            const rolName = relations.roles?.find(r => r.id === item.rol_id)?.nombre || `Rol #${item.rol_id}`;
            const deptName = relations.departamentos?.find(d => d.id === item.departamento_id)?.nombre || `Depto #${item.departamento_id}`;
            const estadoBadge = item.estado == 1 
                ? '<span class="badge badge-active">Activo</span>' 
                : '<span class="badge badge-inactive">Inactivo</span>';

            return `
                <tr data-id="${item.id}">
                    <td>${item.id}</td>
                    <td style="font-weight: 500;">${sanitizeHTML(item.nombre)} ${sanitizeHTML(item.apellido)}</td>
                    <td>${sanitizeHTML(item.email)}</td>
                    <td>${sanitizeHTML(item.telefono)}</td>
                    <td><span style="color: var(--accent); font-weight: 500;">${sanitizeHTML(rolName)}</span></td>
                    <td><span style="color: var(--text-secondary);">${sanitizeHTML(deptName)}</span></td>
                    <td>${estadoBadge}</td>
                    <td style="color: var(--text-muted);">${formatDate(item.created_at)}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-secondary btn-sm btn-icon-only btn-edit-row" title="Editar" data-id="${item.id}">
                                ${ICONS.edit}
                            </button>
                            <button class="btn btn-danger btn-sm btn-icon-only btn-delete-row" title="Eliminar" data-id="${item.id}">
                                ${ICONS.delete}
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    } else if (resource === 'roles' || resource === 'departamentos') {
        tableHeadersHTML = `
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Creado en</th>
                <th>Acciones</th>
            </tr>
        `;

        tableRowsHTML = listData.map(item => {
            const estadoBadge = item.estado == 1 
                ? '<span class="badge badge-active">Activo</span>' 
                : '<span class="badge badge-inactive">Inactivo</span>';

            return `
                <tr data-id="${item.id}">
                    <td>${item.id}</td>
                    <td style="font-weight: 500; color: var(--accent);">${sanitizeHTML(item.nombre)}</td>
                    <td>${sanitizeHTML(item.descripcion || 'Sin descripción')}</td>
                    <td>${estadoBadge}</td>
                    <td style="color: var(--text-muted);">${formatDate(item.created_at)}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-secondary btn-sm btn-icon-only btn-edit-row" title="Editar" data-id="${item.id}">
                                ${ICONS.edit}
                            </button>
                            <button class="btn btn-danger btn-sm btn-icon-only btn-delete-row" title="Eliminar" data-id="${item.id}">
                                ${ICONS.delete}
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    contentArea.innerHTML = `
        <div class="table-container">
            <div class="table-header-bar">
                <h2>Administración de ${title}</h2>
                <button class="btn btn-primary" id="btn-create-trigger">
                    ${ICONS.plus} Crear ${title.slice(0, -1)}
                </button>
            </div>
            <div class="table-responsive">
                <table class="table-modern">
                    <thead>
                        ${tableHeadersHTML}
                    </thead>
                    <tbody>
                        ${tableRowsHTML}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Monta y despliega el formulario adecuado en el Modal global.
 * @param {string} resource ('usuarios' | 'roles' | 'departamentos')
 * @param {string} action ('create' | 'edit')
 * @param {Object} entryData Datos del registro actual (si es edición)
 * @param {Object} relations Datos de roles/departamentos para dropdowns de usuarios
 */
export function openFormModal(resource, action, entryData = null, relations = {}) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    if (!modalOverlay || !modalTitle || !modalBody) return;

    const resourceSingular = resource === 'usuarios' 
        ? 'Usuario' 
        : resource === 'roles' ? 'Rol' : 'Departamento';
        
    modalTitle.textContent = `${action === 'create' ? 'Crear' : 'Editar'} ${resourceSingular}`;

    let formFieldsHTML = '';

    // 1. Campos específicos para ROLES y DEPARTAMENTOS
    if (resource === 'roles' || resource === 'departamentos') {
        const nombreVal = entryData ? sanitizeHTML(entryData.nombre) : '';
        const descVal = entryData ? sanitizeHTML(entryData.descripcion || '') : '';
        const estadoChecked = entryData ? (entryData.estado == 1 ? 'checked' : '') : 'checked';

        formFieldsHTML = `
            <div class="form-group">
                <label class="form-label" for="nombre">Nombre</label>
                <input class="form-control" type="text" id="nombre" name="nombre" value="${nombreVal}" placeholder="Ej. Administrador" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="descripcion">Descripción</label>
                <input class="form-control" type="text" id="descripcion" name="descripcion" value="${descVal}" placeholder="Breve explicación del propósito">
            </div>
            <div class="switch-group">
                <label class="switch">
                    <input type="checkbox" name="estado" ${estadoChecked}>
                    <span class="slider"></span>
                </label>
                <span class="form-label" style="margin-bottom: 0;">Registro Activo</span>
            </div>
        `;
    } 
    // 2. Campos específicos para USUARIOS
    else if (resource === 'usuarios') {
        const nombreVal = entryData ? sanitizeHTML(entryData.nombre) : '';
        const apellidoVal = entryData ? sanitizeHTML(entryData.apellido) : '';
        const emailVal = entryData ? sanitizeHTML(entryData.email) : '';
        const telVal = entryData ? sanitizeHTML(entryData.telefono) : '';
        const passVal = entryData ? sanitizeHTML(entryData.password) : '';
        const estadoChecked = entryData ? (entryData.estado == 1 ? 'checked' : '') : 'checked';
        
        // Cargar dropdowns
        const rolesOptions = (relations.roles || []).map(r => {
            const selected = entryData && entryData.rol_id === r.id ? 'selected' : '';
            return `<option value="${r.id}" ${selected}>${sanitizeHTML(r.nombre)}</option>`;
        }).join('');

        const deptOptions = (relations.departamentos || []).map(d => {
            const selected = entryData && entryData.departamento_id === d.id ? 'selected' : '';
            return `<option value="${d.id}" ${selected}>${sanitizeHTML(d.nombre)}</option>`;
        }).join('');

        formFieldsHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label" for="nombre">Nombre</label>
                    <input class="form-control" type="text" id="nombre" name="nombre" value="${nombreVal}" placeholder="Ej. Juan" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="apellido">Apellido</label>
                    <input class="form-control" type="text" id="apellido" name="apellido" value="${apellidoVal}" placeholder="Ej. Pérez" required>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="email">Correo Electrónico</label>
                <input class="form-control" type="email" id="email" name="email" value="${emailVal}" placeholder="correo@empresa.com" required>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label class="form-label" for="telefono">Teléfono</label>
                    <input class="form-control" type="text" id="telefono" name="telefono" value="${telVal}" placeholder="502-12345678" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="password">Contraseña</label>
                    <input class="form-control" type="password" id="password" name="password" value="${passVal}" placeholder="••••••••" required>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
                <div class="form-group">
                    <label class="form-label" for="rol_id">Rol asignado</label>
                    <select class="form-control" id="rol_id" name="rol_id" required>
                        <option value="" disabled ${!entryData ? 'selected' : ''}>Seleccione...</option>
                        ${rolesOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="departamento_id">Departamento</label>
                    <select class="form-control" id="departamento_id" name="departamento_id" required>
                        <option value="" disabled ${!entryData ? 'selected' : ''}>Seleccione...</option>
                        ${deptOptions}
                    </select>
                </div>
            </div>
            <div class="switch-group">
                <label class="switch">
                    <input type="checkbox" name="estado" ${estadoChecked}>
                    <span class="slider"></span>
                </label>
                <span class="form-label" style="margin-bottom: 0;">Usuario Activo</span>
            </div>
        `;
    }

    // Campos ocultos para auditoría estática
    const audFields = `
        <input type="hidden" name="created_by" value="1">
        <input type="hidden" name="updated_by" value="1">
    `;

    modalBody.innerHTML = `
        <form id="crud-form" autocomplete="off">
            ${formFieldsHTML}
            ${audFields}
            <!-- Botón de envío oculto para validaciones nativas de HTML -->
            <button type="submit" style="display: none;"></button>
        </form>
    `;

    modalOverlay.classList.add('open');
}

/**
 * Cierra el modal restableciendo el DOM interno.
 */
export function closeFormModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    if (!modalOverlay) return;

    modalOverlay.classList.remove('open');
    if (modalBody) {
        modalBody.innerHTML = '';
    }
}

/**
 * Muestra un Toast de notificación en pantalla.
 * @param {string} message Mensaje a desplegar
 * @param {'success'|'error'} type Tipo de notificación
 */
export function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${ICONS[type]}</div>
        <div class="toast-message">${sanitizeHTML(message)}</div>
    `;

    toastContainer.appendChild(toast);
    
    // Provocar reflow para activar animación css
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Desaparecer después de 3.5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        // Eliminar del DOM después de que termine la animación css
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 3500);
}
