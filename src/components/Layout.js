export class Layout {
  constructor(authService, router, activeRoute) {
    this.authService = authService;
    this.router = router;
    this.activeRoute = activeRoute;
  }

  render(content) {
    const currentUser = this.authService.getCurrentUser();
    
    const container = document.createElement('div');
    container.className = 'min-h-screen bg-gray-50';

    container.innerHTML = `
      <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <div class="flex-shrink-0 flex items-center">
                <svg class="w-8 h-8 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-xl font-bold text-gray-900 hidden sm:block">Sistema de Gestão</span>
              </div>
            </div>

            <div class="hidden md:flex md:items-center md:space-x-1">
              ${this.renderNavLink('dashboard', 'Dashboard', `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              `)}
              ${this.renderNavLink('contracts', 'Contratos', `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              `)}
              ${this.renderNavLink('notes', 'Notas Fiscais', `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              `)}
              ${this.renderNavLink('users', 'Usuários', `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              `)}
              ${this.renderNavLink('reports', 'Relatórios', `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              `)}
            </div>

            <div class="flex items-center gap-4">
              <div class="hidden md:block text-right">
                <p class="text-sm font-medium text-gray-900">${currentUser.nome}</p>
                <p class="text-xs text-gray-500">${currentUser.tipo}</p>
              </div>
              <button id="logoutBtn" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
              <button id="mobileMenuBtn" class="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div id="mobileMenu" class="hidden md:hidden border-t border-gray-200 bg-white">
          <div class="px-2 pt-2 pb-3 space-y-1">
            ${this.renderMobileNavLink('dashboard', 'Dashboard')}
            ${this.renderMobileNavLink('contracts', 'Contratos')}
            ${this.renderMobileNavLink('notes', 'Notas Fiscais')}
            ${this.renderMobileNavLink('users', 'Usuários')}
            ${this.renderMobileNavLink('reports', 'Relatórios')}
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="content"></div>
      </main>
    `;

    const contentDiv = container.querySelector('#content');
    contentDiv.appendChild(content);

    this.attachEventListeners(container);

    return container;
  }

  renderNavLink(route, label, iconPath) {
    const isActive = this.activeRoute === route;
    return `
      <a href="#${route}" class="nav-link flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-primary-50 text-primary-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${iconPath}
        </svg>
        ${label}
      </a>
    `;
  }

  renderMobileNavLink(route, label) {
    const isActive = this.activeRoute === route;
    return `
      <a href="#${route}" class="mobile-nav-link block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
        isActive 
          ? 'bg-primary-50 text-primary-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }">
        ${label}
      </a>
    `;
  }

  attachEventListeners(container) {
    const logoutBtn = container.querySelector('#logoutBtn');
    const mobileMenuBtn = container.querySelector('#mobileMenuBtn');
    const mobileMenu = container.querySelector('#mobileMenu');

    logoutBtn?.addEventListener('click', () => {
      if (confirm('Deseja realmente sair do sistema?')) {
        this.authService.logout();
        this.router.navigate('login');
      }
    });

    mobileMenuBtn?.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    container.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}
