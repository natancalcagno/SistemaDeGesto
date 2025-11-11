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
    container.className = 'space-y-8';

    container.innerHTML = `
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-1">Visão geral e atalhos do sistema.</p>
      </div>

      ${expiringContracts.length > 0 ? `
        <div class="alert-warning">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div>
              <p class="font-semibold text-yellow-800">Atenção: Contratos vencendo em breve!</p>
              <p class="text-yellow-700 mt-1 text-sm">
                Você tem <strong>${expiringContracts.length}</strong> contrato(s) com vencimento nos próximos 30 dias.
              </p>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${this.renderStatCard('Contratos', contracts.length, 'contracts', 'bg-blue-100', 'text-blue-600', '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />')}
        ${this.renderStatCard('Notas Fiscais', notes.length, 'notes', 'bg-green-100', 'text-green-600', '<path stroke-linecap="round" stroke-linejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />')}
        ${this.renderStatCard('Usuários', users.length, 'users', 'bg-purple-100', 'text-purple-600', '<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />')}
        ${this.renderStatCard('Relatórios', '', 'reports', 'bg-orange-100', 'text-orange-600', '<path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />', 'Acessar')}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Contratos Recentes</h3>
          ${contracts.length > 0 ? `
            <div class="space-y-4">
              ${contracts.slice(-5).reverse().map(contract => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p class="font-semibold text-gray-800">${contract.numeroContrato}</p>
                    <p class="text-sm text-gray-500">${contract.empresa}</p>
                  </div>
                  <span class="px-3 py-1 text-xs font-semibold rounded-full ${this.getStatusClass(contract.status)}">
                    ${contract.status}
                  </span>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-gray-500 text-center py-8">Nenhum contrato cadastrado.</p>
          `}
        </div>

        <div class="card">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Notas Fiscais Recentes</h3>
          ${notes.length > 0 ? `
            <div class="space-y-4">
              ${notes.slice(-5).reverse().map(note => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p class="font-semibold text-gray-800">NF ${note.numeroNota}</p>
                    <p class="text-sm text-gray-500">${note.empresa}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-800">R$ ${parseFloat(note.valor).toFixed(2)}</p>
                    <p class="text-xs text-gray-500">${new Date(note.dataNota).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-gray-500 text-center py-8">Nenhuma nota fiscal cadastrada.</p>
          `}
        </div>
      </div>
    `;

    return container;
  }
  
  renderStatCard(title, value, link, bgColor, textColor, icon, valueText = null) {
    return `
      <div class="card hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer" onclick="window.location.hash='${link}'">
        <div class="flex items-center justify-between">
          <p class="text-gray-600 font-medium">${title}</p>
          <div class="w-12 h-12 ${bgColor} rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 ${textColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              ${icon}
            </svg>
          </div>
        </div>
        <p class="text-4xl font-bold text-gray-900 mt-4">${valueText || value}</p>
      </div>
    `;
  }

  getExpiringContracts(contracts) {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return contracts.filter(contract => {
      if (!contract.dataVencimento) return false;
      const [year, month, day] = contract.dataVencimento.split('-');
      const expiryDate = new Date(year, month - 1, day);
      return expiryDate >= today && expiryDate <= thirtyDaysFromNow && contract.status === 'Ativo';
    });
  }

  getStatusClass(status) {
    const classes = {
      'Ativo': 'bg-green-100 text-green-800',
      'Vencido': 'bg-red-100 text-red-800',
      'Suspenso': 'bg-yellow-100 text-yellow-800',
      'Cancelado': 'bg-gray-200 text-gray-800'
    };
    return classes[status] || 'bg-gray-200 text-gray-800';
  }
}
