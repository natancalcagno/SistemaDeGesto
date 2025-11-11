import { Layout } from '../components/Layout.js';

export class DashboardView {
  constructor(stateManager, authService, router) {
    this.stateManager = stateManager;
    this.authService = authService;
    this.router = router;
  }

  render() {
    const layout = new Layout(this.authService, this.router, 'dashboard');
    const content = this.renderContent();
    return layout.render(content);
  }

  renderContent() {
    const contracts = this.stateManager.getContracts();
    const notes = this.stateManager.getNotes();
    const users = this.stateManager.getUsers();

    const expiringContracts = this.getExpiringContracts(contracts);

    const container = document.createElement('div');
    container.className = 'space-y-6';

    container.innerHTML = `
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-1">Visão geral do sistema</p>
      </div>

      ${expiringContracts.length > 0 ? `
        <div class="alert-warning">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div>
              <p class="font-medium text-yellow-800">Atenção!</p>
              <p class="text-yellow-700 mt-1">
                ${expiringContracts.length} contrato(s) vencendo nos próximos 30 dias
              </p>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card hover:shadow-lg transition-shadow cursor-pointer" onclick="window.location.hash='contracts'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Contratos</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">${contracts.length}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          ${expiringContracts.length > 0 ? `
            <p class="text-xs text-yellow-600 mt-3 font-medium">
              ${expiringContracts.length} vencendo em breve
            </p>
          ` : ''}
        </div>

        <div class="card hover:shadow-lg transition-shadow cursor-pointer" onclick="window.location.hash='notes'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Notas Fiscais</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">${notes.length}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card hover:shadow-lg transition-shadow cursor-pointer" onclick="window.location.hash='users'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Usuários</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">${users.length}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card hover:shadow-lg transition-shadow cursor-pointer" onclick="window.location.hash='reports'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">Relatórios</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Contratos Recentes</h3>
          ${contracts.length > 0 ? `
            <div class="space-y-3">
              ${contracts.slice(-5).reverse().map(contract => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">${contract.numeroContrato}</p>
                    <p class="text-sm text-gray-600">${contract.empresa}</p>
                  </div>
                  <span class="px-3 py-1 text-xs font-medium rounded-full ${this.getStatusClass(contract.status)}">
                    ${contract.status}
                  </span>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-gray-500 text-center py-8">Nenhum contrato cadastrado</p>
          `}
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Notas Fiscais Recentes</h3>
          ${notes.length > 0 ? `
            <div class="space-y-3">
              ${notes.slice(-5).reverse().map(note => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">NF ${note.numeroNota}</p>
                    <p class="text-sm text-gray-600">${note.empresa}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">R$ ${parseFloat(note.valor).toFixed(2)}</p>
                    <p class="text-xs text-gray-500">${note.dataNota}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-gray-500 text-center py-8">Nenhuma nota fiscal cadastrada</p>
          `}
        </div>
      </div>
    `;

    return container;
  }

  getExpiringContracts(contracts) {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return contracts.filter(contract => {
      const expiryDate = new Date(contract.dataVencimento);
      return expiryDate >= today && expiryDate <= thirtyDaysFromNow && contract.status === 'Ativo';
    });
  }

  getStatusClass(status) {
    const classes = {
      'Ativo': 'bg-green-100 text-green-800',
      'Vencido': 'bg-red-100 text-red-800',
      'Suspenso': 'bg-yellow-100 text-yellow-800',
      'Cancelado': 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
}
