import { Layout } from '../components/Layout.js';

export class ContractsView {
  constructor(stateManager, authService, router) {
    this.stateManager = stateManager;
    this.authService = authService;
    this.router = router;
    this.editingId = null;

    this.stateManager.subscribe('contractsUpdated', () => {
      this.router.loadView('contracts');
    });
  }

  render() {
    const layout = new Layout(this.authService, this.router, 'contracts');
    const content = this.renderContent();
    return layout.render(content);
  }

  renderContent() {
    const contracts = this.stateManager.getContracts();
    const expiringContracts = this.getExpiringContracts(contracts);

    const container = document.createElement('div');
    container.className = 'space-y-6';

    container.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Contratos</h1>
          <p class="text-gray-600 mt-1">Gerencie todos os contratos</p>
        </div>
        <button id="addContractBtn" class="btn-primary">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Novo Contrato
        </button>
      </div>

      ${expiringContracts.length > 0 ? `
        <div class="alert-warning">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div class="flex-1">
              <p class="font-medium text-yellow-800">Contratos vencendo em breve:</p>
              <ul class="mt-2 space-y-1">
                ${expiringContracts.map(contract => {
                  const daysUntilExpiry = this.getDaysUntilExpiry(contract.dataVencimento);
                  return `
                    <li class="text-yellow-700 text-sm">
                      ${contract.numeroContrato} - ${contract.empresa} (vence em ${daysUntilExpiry} dias)
                    </li>
                  `;
                }).join('')}
              </ul>
            </div>
          </div>
        </div>
      ` : ''}

      <div id="contractForm" class="card hidden">
        <h3 class="text-lg font-semibold text-gray-900 mb-4" id="formTitle">Novo Contrato</h3>
        <form id="contractFormElement" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Número do Contrato *</label>
              <input type="text" id="numeroContrato" required class="input-field" placeholder="Ex: 001/2025" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
              <input type="text" id="empresa" required class="input-field" placeholder="Nome da empresa" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data de Início *</label>
              <input type="date" id="dataInicio" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento *</label>
              <input type="date" id="dataVencimento" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select id="status" required class="input-field">
                <option value="Ativo">Ativo</option>
                <option value="Suspenso">Suspenso</option>
                <option value="Vencido">Vencido</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 justify-end pt-4">
            <button type="button" id="cancelBtn" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>

      <div class="card">
        ${contracts.length > 0 ? `
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Número</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Empresa</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Início</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vencimento</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${contracts.map(contract => `
                  <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4 text-sm font-medium text-gray-900">${contract.numeroContrato}</td>
                    <td class="py-3 px-4 text-sm text-gray-700">${contract.empresa}</td>
                    <td class="py-3 px-4 text-sm text-gray-700">${this.formatDate(contract.dataInicio)}</td>
                    <td class="py-3 px-4 text-sm text-gray-700">${this.formatDate(contract.dataVencimento)}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusClass(contract.status)}">
                        ${contract.status}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center justify-center gap-2">
                        <button class="edit-btn p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" data-id="${contract.id}">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button class="delete-btn p-2 text-red-600 hover:bg-red-50 rounded transition-colors" data-id="${contract.id}">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-500">Nenhum contrato cadastrado</p>
            <button onclick="document.getElementById('addContractBtn').click()" class="mt-4 text-primary-600 hover:text-primary-700 font-medium">
              Cadastrar primeiro contrato
            </button>
          </div>
        `}
      </div>
    `;

    this.attachEventListeners(container);
    return container;
  }

  attachEventListeners(container) {
    const addBtn = container.querySelector('#addContractBtn');
    const form = container.querySelector('#contractFormElement');
    const cancelBtn = container.querySelector('#cancelBtn');
    const formContainer = container.querySelector('#contractForm');

    addBtn?.addEventListener('click', () => {
      this.editingId = null;
      form.reset();
      container.querySelector('#formTitle').textContent = 'Novo Contrato';
      formContainer.classList.remove('hidden');
      formContainer.scrollIntoView({ behavior: 'smooth' });
    });

    cancelBtn?.addEventListener('click', () => {
      this.editingId = null;
      form.reset();
      formContainer.classList.add('hidden');
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(form, formContainer);
    });

    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        this.handleEdit(id, formContainer, form);
      });
    });

    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        this.handleDelete(id);
      });
    });
  }

  handleSubmit(form, formContainer) {
    const contractData = {
      numeroContrato: form.querySelector('#numeroContrato').value,
      empresa: form.querySelector('#empresa').value,
      dataInicio: form.querySelector('#dataInicio').value,
      dataVencimento: form.querySelector('#dataVencimento').value,
      status: form.querySelector('#status').value,
    };

    if (this.editingId) {
      this.stateManager.updateContract(this.editingId, contractData);
    } else {
      this.stateManager.addContract(contractData);
    }

    form.reset();
    formContainer.classList.add('hidden');
    this.editingId = null;
  }

  handleEdit(id, formContainer, form) {
    const contracts = this.stateManager.getContracts();
    const contract = contracts.find(c => c.id === id);
    
    if (contract) {
      this.editingId = id;
      form.querySelector('#numeroContrato').value = contract.numeroContrato;
      form.querySelector('#empresa').value = contract.empresa;
      form.querySelector('#dataInicio').value = contract.dataInicio;
      form.querySelector('#dataVencimento').value = contract.dataVencimento;
      form.querySelector('#status').value = contract.status;
      
      document.querySelector('#formTitle').textContent = 'Editar Contrato';
      formContainer.classList.remove('hidden');
      formContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      this.stateManager.deleteContract(id);
    }
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
