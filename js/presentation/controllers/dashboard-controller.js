/* Controlador del Dashboard */
import { ticketRepository } from '../../data/ticket-repository.js';
import { catalogRepository } from '../../data/catalog-repository.js';
import { entities } from '../../domain/entities.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Referencias al DOM
    const ticketsList = document.getElementById('tickets-list');
    const filterSearch = document.getElementById('filter-search');
    const filterCategoria = document.getElementById('filter-categoria');
    const filterPrioridad = document.getElementById('filter-prioridad');
    const filterEstado = document.getElementById('filter-estado');
    const btnClearFilters = document.getElementById('btn-clear-filters');
    
    // Estadísticas
    const statTotal = document.getElementById('stat-total');
    const statProcess = document.getElementById('stat-process');
    const statResolved = document.getElementById('stat-resolved');

    let allTickets = [];
    let categories = [];
    let priorities = [];
    let statuses = [];

    // Mapas para traducción rápida de ID -> Nombre
    const categoryMap = {};
    const priorityMap = {};
    const statusMap = {};

    try {
        // 1. Cargar catálogos en paralelo
        const [cats, prios, stats] = await Promise.all([
            catalogRepository.getAll('categorias'),
            catalogRepository.getAll('prioridades'),
            catalogRepository.getAll('estados')
        ]);

        categories = cats;
        priorities = prios;
        statuses = stats;

        // Construir mapas y poblar selectores
        categories.forEach(c => {
            categoryMap[c.id] = c.nombre;
            const option = new Option(c.nombre, c.id);
            filterCategoria.add(option);
        });

        priorities.forEach(p => {
            priorityMap[p.id] = p.nombre;
            const option = new Option(p.nombre, p.id);
            filterPrioridad.add(option);
        });

        statuses.forEach(s => {
            statusMap[s.id] = s.nombre;
            const option = new Option(s.nombre, s.id);
            filterEstado.add(option);
        });

        // 2. Cargar tickets
        await fetchAndRenderTickets();

    } catch (error) {
        console.error('Error inicializando el dashboard:', error);
        if (ticketsList) {
            ticketsList.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center" style="color: var(--color-danger); padding: 30px;">
                        Error al cargar los datos: ${error.message}
                    </td>
                </tr>
            `;
        }
    }

    async function fetchAndRenderTickets() {
        // Pedimos sólo los activos (estado = 1)
        allTickets = await ticketRepository.getAll({ estado: 1 });
        updateStats();
        applyFilters();
    }

    function updateStats() {
        if (!statTotal || !statProcess || !statResolved) return;
        
        statTotal.innerText = allTickets.length;
        
        // "En Proceso" usualmente es el ID 2
        const inProcessCount = allTickets.filter(t => Number(t.estado_ticket_id) === 2).length;
        statProcess.innerText = inProcessCount;
        
        // "Resuelto" usualmente es el ID 3
        const resolvedCount = allTickets.filter(t => Number(t.estado_ticket_id) === 3).length;
        statResolved.innerText = resolvedCount;
    }

    function applyFilters() {
        const searchVal = filterSearch.value.trim().toLowerCase();
        const catVal = filterCategoria.value;
        const prioVal = filterPrioridad.value;
        const estVal = filterEstado.value;

        const filtered = allTickets.filter(ticket => {
            // Filtro por texto
            const matchesText = !searchVal || 
                String(ticket.id).includes(searchVal) || 
                ticket.titulo.toLowerCase().includes(searchVal) || 
                (ticket.descripcion && ticket.descripcion.toLowerCase().includes(searchVal));

            // Filtro por categoría
            const matchesCat = !catVal || Number(ticket.categoria_ticket_id) === Number(catVal);

            // Filtro por prioridad
            const matchesPrio = !prioVal || Number(ticket.prioridad_ticket_id) === Number(prioVal);

            // Filtro por estado
            const matchesEst = !estVal || Number(ticket.estado_ticket_id) === Number(estVal);

            return matchesText && matchesCat && matchesPrio && matchesEst;
        });

        renderTicketsTable(filtered);
    }

    function renderTicketsTable(tickets) {
        if (!ticketsList) return;

        if (tickets.length === 0) {
            ticketsList.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center" style="padding: 40px; color: var(--text-light);">
                        No se encontraron tickets con los filtros seleccionados.
                    </td>
                </tr>
            `;
            return;
        }

        ticketsList.innerHTML = tickets.map(ticket => {
            const catName = categoryMap[ticket.categoria_ticket_id] || `Categoría ${ticket.categoria_ticket_id}`;
            const prioName = priorityMap[ticket.prioridad_ticket_id] || `Prioridad ${ticket.prioridad_ticket_id}`;
            const estName = statusMap[ticket.estado_ticket_id] || `Estado ${ticket.estado_ticket_id}`;
            
            const prioClass = entities.getPrioridadBadgeClass(prioName);
            const estClass = entities.getEstadoBadgeClass(estName);
            
            const agentName = ticket.nombre_apellido_agente_asignado || '<em>Sin asignar</em>';
            const dateStr = entities.formatDate(ticket.created_at);

            return `
                <tr>
                    <td><strong>#${ticket.id}</strong></td>
                    <td>${escapeHTML(ticket.titulo)}</td>
                    <td>${escapeHTML(catName)}</td>
                    <td><span class="badge ${prioClass}">${escapeHTML(prioName)}</span></td>
                    <td><span class="badge ${estClass}">${escapeHTML(estName)}</span></td>
                    <td>${agentName}</td>
                    <td>${dateStr}</td>
                    <td style="text-align: center;">
                        <a href="./ticket-detalle.html?id=${ticket.id}" class="btn btn-secondary btn-sm" style="display: inline-flex;">
                            Ver Detalle
                        </a>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Limpiar filtros
    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', () => {
            filterSearch.value = '';
            filterCategoria.value = '';
            filterPrioridad.value = '';
            filterEstado.value = '';
            applyFilters();
        });
    }

    // Escuchar cambios
    [filterSearch, filterCategoria, filterPrioridad, filterEstado].forEach(el => {
        if (el) {
            el.addEventListener('input', applyFilters);
        }
    });

    // Función de escape básica para evitar inyección XSS
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
