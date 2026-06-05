/* Controlador de Gestión de Usuarios */
import { userRepository } from '../../data/user-repository.js';
import { catalogRepository } from '../../data/catalog-repository.js';
import { authRepository } from '../../data/auth-repository.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar rol Admin
    if (!authRepository.isAdmin()) {
        window.location.href = './dashboard.html';
        return;
    }

    const currentUser = authRepository.getCurrentUser();
    if (!currentUser) return;

    // Referencias DOM
    const usuariosList = document.getElementById('usuarios-list');
    const modal = document.getElementById('usuario-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('usuario-form');
    const alertErrorGlobal = document.getElementById('alert-error-global');
    const alertErrorModal = document.getElementById('alert-error-modal');

    // Botones modal
    const btnNuevoUsuario = document.getElementById('btn-nuevo-usuario');
    const btnModalClose = document.getElementById('modal-close');
    const btnModalCancel = document.getElementById('modal-cancel');

    // Inputs form
    const inputId = document.getElementById('usuario-id');
    const inputNombre = document.getElementById('nombre');
    const inputApellido = document.getElementById('apellido');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');
    const inputPassword = document.getElementById('password');
    const selectRol = document.getElementById('rol_id');
    const selectDepto = document.getElementById('departamento_id');
    const selectEstado = document.getElementById('estado');
    
    // Agente
    const groupCategoriasAgente = document.getElementById('group-categorias-agente');
    const selectCategorias = document.getElementById('categoria_ticket_id');

    let allUsers = [];
    const roleMap = {};
    const deptoMap = {};
    let categoriesList = [];

    try {
        // Cargar catálogos en paralelo
        const [roles, deptos, cats] = await Promise.all([
            catalogRepository.getAll('roles'),
            catalogRepository.getAll('departamentos'),
            catalogRepository.getAll('categorias')
        ]);

        categoriesList = cats;

        // Poblar selectores
        roles.forEach(r => {
            roleMap[r.id] = r.nombre;
            if (Number(r.estado) === 1) {
                selectRol.add(new Option(r.nombre, r.id));
            }
        });

        deptos.forEach(d => {
            deptoMap[d.id] = d.nombre;
            if (Number(d.estado) === 1) {
                selectDepto.add(new Option(d.nombre, d.id));
            }
        });

        cats.forEach(c => {
            if (Number(c.estado) === 1) {
                selectCategorias.add(new Option(c.nombre, c.id));
            }
        });

        // Cargar usuarios
        await fetchAndRenderUsers();

    } catch (error) {
        console.error('Error al inicializar usuarios:', error);
        showGlobalError(`No se pudieron cargar los datos iniciales: ${error.message}`);
    }

    // Toggle categorí­as de agente
    selectRol.addEventListener('change', () => {
        if (Number(selectRol.value) === 2) {
            groupCategoriasAgente.style.display = 'block';
        } else {
            groupCategoriasAgente.style.display = 'none';
        }
    });

    async function fetchAndRenderUsers() {
        try {
            allUsers = await userRepository.getAll();
            renderUsersTable();
        } catch (error) {
            console.error(error);
            showGlobalError(`Error al obtener usuarios del servidor: ${error.message}`);
        }
    }

    function renderUsersTable() {
        if (!usuariosList) return;

        if (allUsers.length === 0) {
            usuariosList.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center" style="padding: 20px;">
                        No hay usuarios registrados.
                    </td>
                </tr>
            `;
            return;
        }

        usuariosList.innerHTML = allUsers.map(user => {
            const roleName = roleMap[user.rol_id] || `Rol ${user.rol_id}`;
            const deptoName = deptoMap[user.departamento_id] || `Depto ${user.departamento_id}`;
            
            const isUserActive = Number(user.estado) === 1;
            const statusBadge = isUserActive 
                ? '<span class="badge badge-success">Activo</span>'
                : '<span class="badge badge-neutral">Inactivo</span>';

            return `
                <tr>
                    <td><strong>#${user.id}</strong></td>
                    <td>${escapeHTML(user.nombre)} ${escapeHTML(user.apellido)}</td>
                    <td>${escapeHTML(user.email)}</td>
                    <td>${escapeHTML(user.telefono)}</td>
                    <td>${escapeHTML(roleName)}</td>
                    <td>${escapeHTML(deptoName)}</td>
                    <td>${statusBadge}</td>
                    <td style="text-align: center;">
                        <button class="btn btn-secondary btn-sm edit-user-btn" data-id="${user.id}">Editar</button>
                        <button class="btn btn-danger btn-sm delete-user-btn" data-id="${user.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');

        // Asignar eventos de botones
        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(Number(btn.dataset.id)));
        });

        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteUser(Number(btn.dataset.id)));
        });
    }

    // Modal Control
    function openNewModal() {
        modalTitle.innerText = 'Nuevo Usuario';
        form.reset();
        inputId.value = '';
        inputPassword.required = true;
        groupCategoriasAgente.style.display = 'none';
        hideErrors();
        alertErrorModal.style.display = 'none';
        modal.classList.add('show');
    }

    function openEditModal(id) {
        modalTitle.innerText = `Editar Usuario #${id}`;
        form.reset();
        inputId.value = id;
        inputPassword.required = false; // No obligatorio al editar
        hideErrors();
        alertErrorModal.style.display = 'none';

        const user = allUsers.find(u => u.id === id);
        if (!user) return;

        inputNombre.value = user.nombre;
        inputApellido.value = user.apellido;
        inputEmail.value = user.email;
        inputTelefono.value = user.telefono;
        selectRol.value = user.rol_id;
        selectDepto.value = user.departamento_id;
        selectEstado.value = user.estado;

        // Mostrar u ocultar categorías de agente
        if (Number(user.rol_id) === 2) {
            groupCategoriasAgente.style.display = 'block';
            
            // Seleccionar categorías del agente
            const selectedCats = user.categoria_ticket_id || [];
            Array.from(selectCategorias.options).forEach(opt => {
                opt.selected = selectedCats.includes(Number(opt.value));
            });
        } else {
            groupCategoriasAgente.style.display = 'none';
        }

        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
    }

    btnNuevoUsuario.addEventListener('click', openNewModal);
    btnModalClose.addEventListener('click', closeModal);
    btnModalCancel.addEventListener('click', closeModal);

    // Guardar / Enviar Formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideErrors();
        alertErrorModal.style.display = 'none';

        const id = inputId.value;
        const isEditing = id !== '';

        const payload = {
            nombre: inputNombre.value.trim(),
            apellido: inputApellido.value.trim(),
            email: inputEmail.value.trim(),
            telefono: inputTelefono.value.trim(),
            rol_id: selectRol.value,
            departamento_id: selectDepto.value,
            estado: selectEstado.value,
            updated_by: currentUser.id
        };

        // Si se ingresó contraseña, o es creación (donde es required), adjuntarla
        if (inputPassword.value) {
            payload.password = inputPassword.value;
        }

        if (!isEditing && !inputPassword.value) {
            showModalError('La contraseña es obligatoria al crear un usuario.');
            return;
        }

        // Si es agente, extraer categorías
        if (Number(selectRol.value) === 2) {
            const selectedOptions = Array.from(selectCategorias.selectedOptions);
            payload.categoria_ticket_id = selectedOptions.map(opt => Number(opt.value));
        }

        try {
            if (isEditing) {
                await userRepository.update(Number(id), payload);
            } else {
                payload.created_by = currentUser.id;
                await userRepository.create(payload);
            }
            closeModal();
            await fetchAndRenderUsers();
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
                showModalError(error.message || 'Error al guardar el usuario.');
            }
        }
    });

    async function deleteUser(id) {
        if (confirm(`¿Está seguro de que desea eliminar lógicamente al usuario #${id}? El usuario pasará a estar inactivo.`)) {
            try {
                const success = await userRepository.delete(id, currentUser.id);
                if (success) {
                    await fetchAndRenderUsers();
                }
            } catch (error) {
                console.error(error);
                showGlobalError(error.message || 'Error al eliminar usuario.');
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
});
