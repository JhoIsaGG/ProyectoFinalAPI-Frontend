/* Componente Sidebar Reutilizable */
import { authRepository } from '../../data/auth-repository.js';

document.addEventListener('DOMContentLoaded', () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    const user = authRepository.getCurrentUser();
    const isAdmin = authRepository.isAdmin();

    const currentPath = window.location.pathname;

    const isActive = (fileName) => {
        return currentPath.includes(fileName) ? 'active' : '';
    };

    // SVGs Integrados
    const svgDashboard = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg>`;
    const svgPlus = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>`;
    const svgUsers = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`;
    const svgRoles = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`;
    const svgDept = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`;
    const svgCat = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
    const svgStatus = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    const svgPrio = `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>`;

    let adminMenuHtml = '';

    if (isAdmin) {
        adminMenuHtml = `
            <div class="menu-category">Administración</div>
            
            <a href="/proyectofinalapi/Frontend/views/usuarios.html" class="menu-item ${isActive('usuarios.html')}">
                ${svgUsers} Usuarios
            </a>
            
            <a href="/proyectofinalapi/Frontend/views/roles.html" class="menu-item ${isActive('roles.html')}">
                ${svgRoles} Roles
            </a>
            
            <a href="/proyectofinalapi/Frontend/views/departamentos.html" class="menu-item ${isActive('departamentos.html')}">
                ${svgDept} Departamentos
            </a>
            
            <div class="menu-category">Catálogos de Ticket</div>
            
            <a href="/proyectofinalapi/Frontend/views/categorias.html" class="menu-item ${isActive('categorias.html')}">
                ${svgCat} Categorías
            </a>
            
            <a href="/proyectofinalapi/Frontend/views/estados.html" class="menu-item ${isActive('estados.html')}">
                ${svgStatus} Estados
            </a>
            
            <a href="/proyectofinalapi/Frontend/views/prioridades.html" class="menu-item ${isActive('prioridades.html')}">
                ${svgPrio} Prioridades
            </a>
        `;
    }

    sidebarContainer.innerHTML = `
        <div class="sidebar">
            <div class="sidebar-logo">
                Mesa de Ayuda
            </div>
            <div class="sidebar-menu">
                <div class="menu-category">Panel Principal</div>
                
                <a href="/proyectofinalapi/Frontend/views/dashboard.html" class="menu-item ${isActive('dashboard.html')} ${isActive('ticket-detalle.html')}">
                    ${svgDashboard} Bandeja de Tickets
                </a>
                
                <a href="/proyectofinalapi/Frontend/views/ticket-crear.html" class="menu-item ${isActive('ticket-crear.html')}">
                    ${svgPlus} Crear Ticket
                </a>

                ${adminMenuHtml}
            </div>
        </div>
    `;
});
