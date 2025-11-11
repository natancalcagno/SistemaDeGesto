export class Layout {
  constructor(authService, router, activeRoute) {
    this.authService = authService;
    this.router = router;
    this.activeRoute = activeRoute;
  }

  render(content) {
    const currentUser = this.authService.getCurrentUser();
    
    const container = document.createElement('div');
    container.className = 'flex h-screen bg-gray-100 font-sans';

    const icons = {
      dashboard: `<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />`,
      contracts: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
      notes: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />`,
      users: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />`,
      reports: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
    };

    container.innerHTML = `
      <!-- Sidebar -->
      <aside id="sidebar" class="w-64 bg-gray-900 text-gray-300 flex-shrink-0 hidden md:flex md:flex-col transition-all duration-300">
        <div class="h-20 flex items-center justify-center border-b border-gray-800">
          <div class="flex items-center">
            <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              ${icons.contracts}
            </svg>
            <span class="ml-3 text-xl font-bold text-white">Gestor</span>
          </div>
        </div>
        <nav class="flex-1 px-4 py-6 space-y-2">
          ${this.renderNavLink('dashboard', 'Dashboard', icons.dashboard)}
          ${this.renderNavLink('contracts', 'Contratos', icons.contracts)}
          ${this.renderNavLink('notes', 'Notas Fiscais', icons.notes)}
          ${this.renderNavLink('users', 'Usuários', icons.users)}
          ${this.renderNavLink('reports', 'Relatórios', icons.reports)}
        </nav>
        <div class="p-4 border-t border-gray-800">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-semibold text-white">${currentUser.nome}</p>
              <p class="text-xs text-gray-400">${currentUser.tipo}</p>
            </div>
            <button id="logoutBtn" title="Sair" class="p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Mobile Header -->
        <header class="md:hidden bg-white shadow-md flex justify-between items-center p-4">
          <div class="flex items-center">
            <svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              ${icons.contracts}
            </svg>
            <span class="ml-2 text-lg font-bold">Gestor</span>
          </div>
          <button id="mobileMenuBtn" class="p-2 rounded-md text-gray-600 hover:bg-gray-100">
            <svg id="menuIcon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <svg id="closeIcon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>

        <!-- Content Area -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          <div id="content"></div>
        </main>
      </div>
    `;

    const contentDiv = container.querySelector('#content');
    contentDiv.appendChild(content);

    this.attachEventListeners(container);

    return container;
  }

  renderNavLink(route, label, iconPath) {
    const isActive = this.activeRoute === route;
    return `
      <a href="#${route}" class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-primary-600 text-white shadow-lg' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          ${iconPath}
        </svg>
        <span>${label}</span>
      </a>
    `;
  }

  attachEventListeners(container) {
    const logoutBtn = container.querySelector('#logoutBtn');
    logoutBtn?.addEventListener('click', () => {
      if (confirm('Deseja realmente sair do sistema?')) {
        this.authService.logout();
        this.router.navigate('login');
      }
    });

    const mobileMenuBtn = container.querySelector('#mobileMenuBtn');
    const sidebar = container.querySelector('#sidebar');
    const menuIcon = container.querySelector('#menuIcon');
    const closeIcon = container.querySelector('#closeIcon');

    mobileMenuBtn?.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
      menuIcon.classList.toggle('hidden');
      closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu on navigation
    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          sidebar.classList.add('hidden');
          menuIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        }
      });
    });
  }
}
