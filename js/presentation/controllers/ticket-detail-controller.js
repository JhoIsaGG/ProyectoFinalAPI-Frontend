/* Controlador del Detalle de Ticket */
import { ticketRepository } from '../../data/ticket-repository.js';
import { catalogRepository } from '../../data/catalog-repository.js';
import { userRepository } from '../../data/user-repository.js';
import { authRepository } from '../../data/auth-repository.js';
import { entities } from '../../domain/entities.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Parsea el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = Number(urlParams.get('id'));

    const alertError = document.getElementById('alert-error');
    
    if (!ticketId) {
        showGlobalError('ID de ticket inválido.');
        return;
    }

    const currentUser = authRepository.getCurrentUser();
    if (!currentUser) return;

    // Referencias del DOM
    const ticketIdTitle = document.getElementById('ticket-id-title');
    const ticketSubtitle = document.getElementById('ticket-subtitle');
    const ticketDescripcion = document.getElementById('ticket-descripcion');
    const ticketCategoria = document.getElementById('ticket-categoria');
    const ticketPrioridad = document.getElementById('ticket-prioridad');
    const ticketEstado = document.getElementById('ticket-estado');
    const ticketAgente = document.getElementById('ticket-agente');
    const ticketCreador = document.getElementById('ticket-creador');
    const ticketFecha = document.getElementById('ticket-fecha');

    const panelEstadoCambio = document.getElementById('panel-estado-cambio');
    const selectCambioEstado = document.getElementById('select-cambio-estado');
    const updateStatusForm = document.getElementById('update-status-form');
    const btnDeleteTicket = document.getElementById('btn-delete-ticket');

    const commentsFeed = document.getElementById('comments-feed');
    const commentForm = document.getElementById('comment-form');
    const commentText = document.getElementById('comment-text');

    let ticketData = null;
    const categoryMap = {};
    const priorityMap = {};
    const statusMap = {};
    const userMap = {};

    try {
        // 1. Cargar catálogos y usuarios en paralelo
        const [cats, prios, stats, users] = await Promise.all([
            catalogRepository.getAll('categorias'),
            catalogRepository.getAll('prioridades'),
            catalogRepository.getAll('estados'),
            userRepository.getAll()
        ]);

        cats.forEach(c => categoryMap[c.id] = c.nombre);
        prios.forEach(p => priorityMap[p.id] = p.nombre);
        stats.forEach(s => {
            statusMap[s.id] = s.nombre;
            // Poblar dropdown de cambiar estado
            if (Number(s.estado) === 1 && selectCambioEstado) {
                selectCambioEstado.add(new Option(s.nombre, s.id));
            }
        });
        users.forEach(u => userMap[u.id] = `${u.nombre} ${u.apellido}`);

        // 2. Cargar detalles del ticket
        await loadTicketDetails();

        // 3. Mostrar paneles basados en el rol
        const userRol = Number(currentUser.rol_id);
        
        // Superadministrador (1) o Agente de soporte (2) pueden gestionar el estado
        if (userRol === 1 || userRol === 2) {
            if (panelEstadoCambio) {
                panelEstadoCambio.style.display = 'block';
                if (selectCambioEstado) selectCambioEstado.value = ticketData.estado_ticket_id;
            }
        }

        // Superadministrador (1) puede eliminar físicamente o lógicamente
        if (userRol === 1) {
            if (btnDeleteTicket) btnDeleteTicket.style.display = 'block';
        }

        // 4. Cargar comentarios
        await loadComments();

    } catch (error) {
        console.error('Error al inicializar los detalles del ticket:', error);
        showGlobalError(`Error al cargar datos del ticket: ${error.message}`);
    }

    async function loadTicketDetails() {
        ticketData = await ticketRepository.getById(ticketId);
        
        if (!ticketData || Number(ticketData.estado) === 0) {
            throw new Error('El ticket no existe o ha sido eliminado.');
        }

        if (ticketIdTitle) ticketIdTitle.innerText = `Ticket #${ticketData.id}: ${ticketData.titulo}`;
        if (ticketSubtitle) ticketSubtitle.innerText = `Detalles técnicos y registro de actividades`;
        if (ticketDescripcion) ticketDescripcion.innerText = ticketData.descripcion;
        
        const catName = categoryMap[ticketData.categoria_ticket_id] || `ID: ${ticketData.categoria_ticket_id}`;
        const prioName = priorityMap[ticketData.prioridad_ticket_id] || `ID: ${ticketData.prioridad_ticket_id}`;
        const estName = statusMap[ticketData.estado_ticket_id] || `ID: ${ticketData.estado_ticket_id}`;

        const prioClass = entities.getPrioridadBadgeClass(prioName);
        const estClass = entities.getEstadoBadgeClass(estName);

        if (ticketCategoria) ticketCategoria.innerText = catName;
        if (ticketPrioridad) {
            ticketPrioridad.innerHTML = `<span class="badge ${prioClass}">${prioName}</span>`;
        }
        if (ticketEstado) {
            ticketEstado.innerHTML = `<span class="badge ${estClass}">${estName}</span>`;
        }
        if (ticketAgente) {
            ticketAgente.innerText = ticketData.nombre_apellido_agente_asignado || 'Sin asignar';
        }
        if (ticketCreador) {
            ticketCreador.innerText = userMap[ticketData.created_by] || `Usuario #${ticketData.created_by}`;
        }
        if (ticketFecha) {
            ticketFecha.innerText = entities.formatDate(ticketData.created_at);
        }
    }

    async function loadComments() {
        if (!commentsFeed) return;
        
        try {
            const comments = await ticketRepository.getComments(ticketId);
            
            // Filtrar los comentarios eliminados (estado === 0)
            const activeComments = comments.filter(c => Number(c.estado) === 1);

            if (activeComments.length === 0) {
                commentsFeed.innerHTML = `
                    <div class="text-center" style="color: var(--text-light); padding: 20px;">
                        No hay comentarios registrados para este ticket.
                    </div>
                `;
                return;
            }

            commentsFeed.innerHTML = activeComments.map(c => {
                const authorName = userMap[c.usuario_id] || `Usuario #${c.usuario_id}`;
                const dateStr = entities.formatDate(c.created_at);
                
                return `
                    <div class="comment-card">
                        <div class="comment-header">
                            <span class="comment-author">${escapeHTML(authorName)}</span>
                            <span class="comment-date">${dateStr}</span>
                        </div>
                        <div class="comment-body">${escapeHTML(c.descripcion)}</div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
            commentsFeed.innerHTML = `
                <div class="text-center" style="color: var(--color-danger); padding: 20px;">
                    Error al cargar los comentarios.
                </div>
            `;
        }
    }

    // Evento cambiar estado
    if (updateStatusForm) {
        updateStatusForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            alertError.style.display = 'none';

            const newStateId = Number(selectCambioEstado.value);
            
            try {
                const updated = await ticketRepository.update(ticketId, {
                    estado_ticket_id: newStateId,
                    updated_by: currentUser.id
                });

                if (updated) {
                    // Recargar detalles
                    await loadTicketDetails();
                    alert('El estado del ticket ha sido actualizado.');
                }
            } catch (error) {
                console.error(error);
                alertError.innerText = error.message || 'Error al actualizar el estado.';
                alertError.style.display = 'block';
            }
        });
    }

    // Evento eliminar ticket
    if (btnDeleteTicket) {
        btnDeleteTicket.addEventListener('click', async () => {
            if (confirm('¿Está seguro de que desea eliminar este ticket de manera lógica? El ticket dejará de figurar en los tableros.')) {
                try {
                    const deleted = await ticketRepository.delete(ticketId, currentUser.id);
                    if (deleted) {
                        alert('Ticket eliminado correctamente.');
                        window.location.href = './dashboard.html';
                    }
                } catch (error) {
                    console.error(error);
                    alertError.innerText = error.message || 'Error al eliminar el ticket.';
                    alertError.style.display = 'block';
                }
            }
        });
    }

    // Evento agregar comentario
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            alertError.style.display = 'none';
            
            const text = commentText.value.trim();
            if (!text) return;

            try {
                const newComment = await ticketRepository.addComment(ticketId, {
                    usuario_id: currentUser.id,
                    descripcion: text,
                    created_by: currentUser.id
                });

                if (newComment) {
                    commentText.value = '';
                    await loadComments();
                }
            } catch (error) {
                console.error(error);
                alertError.innerText = error.message || 'Error al guardar el comentario.';
                alertError.style.display = 'block';
            }
        });
    }

    function showGlobalError(msg) {
        if (alertError) {
            alertError.innerText = msg;
            alertError.style.display = 'block';
        }
        const grid = document.querySelector('.ticket-grid');
        if (grid) {
            grid.style.opacity = '0.3';
            grid.style.pointerEvents = 'none';
        }
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
