/* Controlador de Catálogo: Categorías de Ticket */
import { catalogRepository } from '../../data/catalog-repository.js';
import { authRepository } from '../../data/auth-repository.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Seguridad: Sólo administradores
    if (!authRepository.isAdmin()) {
        window.location.href = './dashboard.html';
        return;
    }

    const currentUser = authRepository.getCurrentUser();
    if (!currentUser) return;

    // Referencias DOM
    const listTable = document.getElementById('catalogo-list');
    const modal = document.getElementById('catalogo-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('catalogo-form');
    const alertErrorGlobal = document.getElementById('alert-error-global');
    const alertErrorModal = document.getElementById('alert-error-modal');

    // Inputs form
    const inputId = document.getElementById('item-id');
    const inputNombre = document.getElementById('nombre');
    const selectEstado = document.getElementById('estado');

    // Botones modal
    const btnNuevo = document.getElementById('btn-nuevo-catalogo');
    const btnClose = document.getElementById('modal-close');
    const btnCancel = document.getElementById('modal-cancel');

    let allItems = [];

    async function loadItems() {
        try {
            alertErrorGlobal.style.display = 'none';
            allItems = await catalogRepository.getAll('categorias');
            renderTable();
        } catch (error) {
            console.error(error);
            showGlobalError(`Error al cargar las categorías: ${error.message}`);
        }
    }

    function renderTable() {
        if (!listTable) return;

        if (allItems.length === 0) {
            listTable.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center" style="padding: 20px;">
                        No hay categorías registradas.
                    </td>
                </tr>
            `;
            return;
        }

        listTable.innerHTML = allItems.map(item => {
            const isItemActive = Number(item.estado) === 1;
            const statusBadge = isItemActive
                ? '<span class="badge badge-success">Activo</span>'
                : '<span class="badge badge-neutral">Inactivo</span>';

            return `
                <tr>
                    <td><strong>#${item.id}</strong></td>
                    <td>${escapeHTML(item.nombre)}</td>
                    <td>${statusBadge}</td>
                    <td style="text-align: center;">
                        <button class="btn btn-secondary btn-sm edit-btn" data-id="${item.id}">Editar</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');

        // Eventos
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(Number(btn.dataset.id)));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteItem(Number(btn.dataset.id)));
        });
    }

    function openNewModal() {
        modalTitle.innerText = 'Nueva Categoría';
        form.reset();
        inputId.value = '';
        hideErrors();
        alertErrorModal.style.display = 'none';
        modal.classList.add('show');
    }

    function openEditModal(id) {
        modalTitle.innerText = `Editar Categoría #${id}`;
        form.reset();
        inputId.value = id;
        hideErrors();
        alertErrorModal.style.display = 'none';

        const item = allItems.find(x => x.id === id);
        if (!item) return;

        inputNombre.value = item.nombre;
        selectEstado.value = item.estado;

        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
    }

    btnNuevo.addEventListener('click', openNewModal);
    btnClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideErrors();
        alertErrorModal.style.display = 'none';

        const id = inputId.value;
        const isEditing = id !== '';

        const payload = {
            nombre: inputNombre.value.trim(),
            estado: selectEstado.value,
            created_by: currentUser.id,
            updated_by: currentUser.id
        };

        try {
            if (isEditing) {
                await catalogRepository.update('categorias', Number(id), payload);
            } else {
                await catalogRepository.create('categorias', payload);
            }
            closeModal();
            await loadItems();
        } catch (error) {
            console.error(error);
            if (error.errors) {
                Object.keys(error.errors).forEach(field => {
                    const errDiv = document.getElementById(`error-${field}`);
                    if (errDiv) {
                        errDiv.innerText = error.errors[field];
                        errDiv.style.display = 'block';
                    }
                });
                showModalError('Por favor corrija los errores del formulario.');
            } else {
                showModalError(error.message || 'Error al guardar la categoría.');
            }
        }
    });

    async function deleteItem(id) {
        if (confirm(`¿Está seguro de que desea eliminar lógicamente la categoría #${id}?`)) {
            try {
                const success = await catalogRepository.delete('categorias', id, currentUser.id);
                if (success) {
                    await loadItems();
                }
            } catch (error) {
                console.error(error);
                showGlobalError(error.message || 'Error al eliminar la categoría.');
            }
        }
    }

    function showModalError(msg) {
        alertErrorModal.innerText = msg;
        alertErrorModal.style.display = 'block';
    }

    function showGlobalError(msg) {
        alertErrorGlobal.innerText = msg;
        alertErrorGlobal.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function hideErrors() {
        document.querySelectorAll('.form-error').forEach(el => {
            el.innerText = '';
            el.style.display = 'none';
        });
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Inicializar carga
    await loadItems();
});
