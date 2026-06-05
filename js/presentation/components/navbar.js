/* Componente Navbar Reutilizable */
import { authRepository } from '../../data/auth-repository.js';

document.addEventListener('DOMContentLoaded', () => {
    // Redirige al login si no tiene sesión activa
    authRepository.checkAuthOrRedirect();

    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    const user = authRepository.getCurrentUser();
    if (!user) return;

    // Traducir rol ID
    let roleName = 'Usuario';
    const rolId = Number(user.rol_id);
    if (rolId === 1) roleName = 'Superadministrador';
    else if (rolId === 2) roleName = 'Agente de Soporte';
    else if (rolId === 3) roleName = 'Empleado';

    // Determinar nombre de sección según ruta
    let sectionTitle = 'Mesa de Ayuda';
    const path = window.location.pathname;
    if (path.includes('dashboard.html')) sectionTitle = 'Bandeja de Tickets';
    else if (path.includes('ticket-crear.html')) sectionTitle = 'Nuevo Ticket';
    else if (path.includes('ticket-detalle.html')) sectionTitle = 'Detalle de Ticket';
    else if (path.includes('usuarios.html')) sectionTitle = 'Catálogo: Usuarios';
    else if (path.includes('roles.html')) sectionTitle = 'Catálogo: Roles';
    else if (path.includes('departamentos.html')) sectionTitle = 'Catálogo: Departamentos';
    else if (path.includes('categorias.html')) sectionTitle = 'Catálogo: Categorías';
    else if (path.includes('estados.html')) sectionTitle = 'Catálogo: Estados';
    else if (path.includes('prioridades.html')) sectionTitle = 'Catálogo: Prioridades';

    navbarContainer.innerHTML = `
        <div class="navbar w-full">
            <h2 class="navbar-title" style="font-weight: 700; font-size: 1.25rem;">${sectionTitle}</h2>
            <div class="navbar-user">
                <div class="user-info">
                    <div class="user-name">${user.nombre} ${user.apellido}</div>
                    <div class="user-role">${roleName}</div>
                </div>
                <button id="btn-logout" class="logout-btn">
                    Cerrar Sesión
                </button>
            </div>
        </div>
    `;

    // Asignar evento al botón de logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Está seguro de que desea cerrar la sesión?')) {
                authRepository.logout();
            }
        });
    }
});
