import { Layout } from '../components/Layout.js';

export class ReportsView {
  constructor(stateManager, authService, router) {
    this.stateManager = stateManager;
    this.authService = authService;
    this.router = router;
  }

  render() {
    const layout = new Layout(this.authService, this.router, 'reports');
    const content = this.renderContent();
    return layout.render(content);
  }

  renderContent() {
    const contracts = this.stateManager.getContracts();
    const notes = this.stateManager.getNotes();

    const container = document.createElement('div');
    container.className = 'space-y-6';

    const contractsByStatus = this.groupByStatus(contracts);
    const totalNotesValue = notes.reduce((sum, note) => sum + parseFloat(note.valor), 0);

    container.innerHTML = `
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p class="text-gray-600 mt-1">Visualize estatísticas e gere relatórios</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Contratos por Status</h3>
          <div class="space-y-3">
            ${Object.entries(contractsByStatus).map(([status, count]) => `
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 text-xs font-medium rounded-full ${this.getStatusClass(status)}">
                    ${status}
                  </span>
                </div>
                <span class="text-2xl font-bold text-gray-900">${count}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumo de Notas Fiscais</h3>
          <div class="space-y-4">
            <div class="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <p class="text-sm text-green-700 font-medium">Total de Notas</p>
              <p class="text-3xl font-bold text-green-900 mt-1">${notes.length}</p>
            </div>
            <div class="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <p class="text-sm text-blue-700 font-medium">Valor Total</p>
              <p class="text-3xl font-bold text-blue-900 mt-1">R$ ${totalNotesValue.toFixed(2)}</p>
            </div>
            <div class="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <p class="text-sm text-purple-700 font-medium">Valor Médio</p>
              <p class="text-3xl font-bold text-purple-900 mt-1">
                R$ ${notes.length > 0 ? (totalNotesValue / notes.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Notas por Empresa</h3>
          <button id="exportBtn" class="btn-secondary text-sm">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </button>
        </div>
        ${this.renderNotesByCompany(notes)}
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Contratos Próximos ao Vencimento</h3>
        ${this.renderExpiringContracts(contracts)}
      </div>
    `;

    this.attachEventListeners(container);
    return container;
  }

  renderNotesByCompany(notes) {
    const notesByCompany = {};
    
    notes.forEach(note => {
      if (!notesByCompany[note.empresa]) {
        notesByCompany[note.empresa] = {
          count: 0,
          total: 0
        };
      }
      notesByCompany[note.empresa].count++;
      notesByCompany[note.empresa].total += parseFloat(note.valor);
    });

    const sortedCompanies = Object.entries(notesByCompany)
      .sort((a, b) => b[1].total - a[1].total);

    if (sortedCompanies.length === 0) {
      return '<p class="text-gray-500 text-center py-8">Nenhuma nota fiscal cadastrada</p>';
    }

    return `
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Empresa</th>
              <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">Quantidade</th>
              <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            ${sortedCompanies.map(([company, data]) => `
              <tr class="border-b border-gray-100">
                <td class="py-3 px-4 text-sm text-gray-900">${company}</td>
                <td class="py-3 px-4 text-sm text-center text-gray-700">${data.count}</td>
                <td class="py-3 px-4 text-sm text-right font-medium text-gray-900">R$ ${data.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderExpiringContracts(contracts) {
    const expiringContracts = this.getExpiringContracts(contracts);

    if (expiringContracts.length === 0) {
      return '<p class="text-gray-500 text-center py-8">Nenhum contrato próximo ao vencimento</p>';
    }

    return `
      <div class="space-y-3">
        ${expiringContracts.map(contract => {
          const daysUntilExpiry = this.getDaysUntilExpiry(contract.dataVencimento);
          return `
            <div class="flex items-center justify-between p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div>
                <p class="font-medium text-gray-900">${contract.numeroContrato}</p>
                <p class="text-sm text-gray-600">${contract.empresa}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-yellow-800">
                  Vence em ${daysUntilExpiry} dia${daysUntilExpiry !== 1 ? 's' : ''}
                </p>
                <p class="text-xs text-gray-600">${this.formatDate(contract.dataVencimento)}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  attachEventListeners(container) {
    const exportBtn = container.querySelector('#exportBtn');
    
    exportBtn?.addEventListener('click', () => {
      this.exportToCSV();
    });
  }

  exportToCSV() {
    const notes = this.stateManager.getNotes();
    
    if (notes.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    let csv = 'Data de Entrada,Empenho,Empresa,Setor,Número da Nota,Data da Nota,Valor,Data de Saída,Observações\n';
    
    notes.forEach(note => {
      csv += `${note.dataEntrada},${note.empenho},${note.empresa},${note.setor},${note.numeroNota},${note.dataNota},${note.valor},${note.dataSaida || ''},${note.observacao || ''}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notas_fiscais_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  groupByStatus(contracts) {
    const grouped = {
      'Ativo': 0,
      'Suspenso': 0,
      'Vencido': 0,
      'Cancelado': 0
    };

    contracts.forEach(contract => {
      grouped[contract.status]++;
    });

    return grouped;
  }

  getExpiringContracts(contracts) {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return contracts
      .filter(contract => {
        const expiryDate = new Date(contract.dataVencimento);
        return expiryDate >= today && expiryDate <= thirtyDaysFromNow && contract.status === 'Ativo';
      })
      .sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));
  }

  getDaysUntilExpiry(date) {
    const today = new Date();
    const expiryDate = new Date(date);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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

  destroy() {
  }
}
