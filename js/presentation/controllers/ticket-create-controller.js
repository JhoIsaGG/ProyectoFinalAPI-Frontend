/* Controlador para Crear Tickets */
import { ticketRepository } from '../../data/ticket-repository.js';
import { catalogRepository } from '../../data/catalog-repository.js';
import { authRepository } from '../../data/auth-repository.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('create-ticket-form');
    const selectCategoria = document.getElementById('categoria');
    const selectPrioridad = document.getElementById('prioridad');
    const selectEstado = document.getElementById('estado');
    const alertError = document.getElementById('alert-error');
    const alertSuccess = document.getElementById('alert-success');

    if (!form) return;

    // Obtener usuario actual
    const currentUser = authRepository.getCurrentUser();
    if (!currentUser) return;

    try {
        // Cargar catálogos
        const [cats, prios, stats] = await Promise.all([
            catalogRepository.getAll('categorias'),
            catalogRepository.getAll('prioridades'),
            catalogRepository.getAll('estados')
        ]);

        // Poblar categorías
        cats.forEach(c => {
            if (Number(c.estado) === 1) {
                selectCategoria.add(new Option(c.nombre, c.id));
            }
        });

        // Poblar prioridades
        prios.forEach(p => {
            if (Number(p.estado) === 1) {
                selectPrioridad.add(new Option(p.nombre, p.id));
            }
        });

        // Buscar el estado 'Abierto' (o 'abierto')
        const openState = stats.find(s => s.nombre.toLowerCase() === 'abierto' && Number(s.estado) === 1);
        if (openState) {
            selectEstado.value = openState.id;
            document.getElementById('estado-display').value = openState.nombre;
        } else {
            // Fallback por si no lo encuentra o está inactivo
            const defaultState = stats.find(s => Number(s.estado) === 1);
            if (defaultState) {
                selectEstado.value = defaultState.id;
                document.getElementById('estado-display').value = defaultState.nombre;
            }
        }

    } catch (error) {
        console.error('Error al cargar catálogos:', error);
        showError('No se pudieron precargar los catálogos necesarios. Revise la conexión con el servidor API.');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Resetear errores anteriores
        hideErrors();
        alertError.style.display = 'none';
        alertSuccess.style.display = 'none';

        const payload = {
            titulo: document.getElementById('titulo').value.trim(),
            descripcion: document.getElementById('descripcion').value.trim(),
            categoria_ticket_id: selectCategoria.value,
            prioridad_ticket_id: selectPrioridad.value,
            estado_ticket_id: selectEstado.value,
            created_by: currentUser.id
        };

        try {
            const result = await ticketRepository.create(payload);
            if (result) {
                alertSuccess.style.display = 'block';
                form.reset();
                setTimeout(() => {
                    window.location.href = './dashboard.html';
                }, 1500);
            }
        } catch (error) {
            console.error('Error al crear ticket:', error);

            if (error.errors) {
                // Mostrar errores de validación de campos específicos
                Object.keys(error.errors).forEach(field => {
                    let fieldId = field;
                    if (field === 'categoria_ticket_id') fieldId = 'categoria';
                    if (field === 'prioridad_ticket_id') fieldId = 'prioridad';
                    if (field === 'estado_ticket_id') fieldId = 'estado';

                    const errDiv = document.getElementById(`error-${fieldId}`);
                    if (errDiv) {
                        errDiv.innerText = error.errors[field];
                        errDiv.style.display = 'block';
                    }
                });
                showError('Por favor corrija los errores de validación en el formulario.');
            } else {
                showError(error.message || 'Error al guardar el ticket en el servidor.');
            }
        }
    });

    function showError(msg) {
        alertError.innerText = msg;
        alertError.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function hideErrors() {
        document.querySelectorAll('.form-error').forEach(el => {
            el.innerText = '';
            el.style.display = 'none';
        });
    }
});
