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
          <h1 class="text-3xl font-bold text-gray-900">Gerenciamento de Contratos</h1>
          <p class="text-gray-600 mt-1">Adicione, edite e visualize todos os contratos.</p>
        </div>
        <button id="addContractBtn" class="btn-primary flex items-center justify-center gap-2 w-full md:w-auto">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          Novo Contrato
        </button>
      </div>

      ${expiringContracts.length > 0 ? `
        <div class="alert-warning">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            <div>
              <p class="font-semibold text-yellow-800">Contratos vencendo em breve:</p>
              <ul class="mt-1 space-y-1 list-disc list-inside">
                ${expiringContracts.map(c => `<li class="text-yellow-700 text-sm">${c.numeroContrato} (${c.empresa}) - vence em ${this.getDaysUntilExpiry(c.dataVencimento)} dias</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      ` : ''}
      
      <div id="contractFormContainer"></div>

      <div class="card">
        ${contracts.length > 0 ? `
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th class="p-4 font-semibold">Número</th>
                  <th class="p-4 font-semibold">Empresa</th>
                  <th class="p-4 font-semibold">Início</th>
                  <th class="p-4 font-semibold">Vencimento</th>
                  <th class="p-4 font-semibold">Status</th>
                  <th class="p-4 font-semibold text-center">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${contracts.map(contract => `
                  <tr class="hover:bg-gray-50">
                    <td class="p-4 font-medium text-gray-900">${contract.numeroContrato}</td>
                    <td class="p-4 text-gray-700">${contract.empresa}</td>
                    <td class="p-4 text-gray-700">${this.formatDate(contract.dataInicio)}</td>
                    <td class="p-4 text-gray-700">${this.formatDate(contract.dataVencimento)}</td>
                    <td class="p-4">
                      <span class="px-2 py-1 text-xs font-semibold rounded-full ${this.getStatusClass(contract.status)}">
                        ${contract.status}
                      </span>
                    </td>
                    <td class="p-4">
                      <div class="flex items-center justify-center gap-2">
                        <button class="edit-btn p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" data-id="${contract.id}" title="Editar">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                        </button>
                        <button class="delete-btn p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors" data-id="${contract.id}" title="Excluir">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="text-center py-16">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <h3 class="text-lg font-semibold text-gray-800">Nenhum contrato cadastrado</h3>
            <p class="text-gray-500 mt-1">Comece adicionando um novo contrato.</p>
            <button onclick="document.getElementById('addContractBtn').click()" class="mt-4 btn-primary">
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
    container.querySelector('#addContractBtn')?.addEventListener('click', () => this.showFormModal());

    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showFormModal(parseInt(btn.dataset.id)));
    });

    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleDelete(parseInt(btn.dataset.id)));
    });
  }

  showFormModal(id = null) {
    this.editingId = id;
    const isEditing = id !== null;
    const contract = isEditing ? this.stateManager.getContracts().find(c => c.id === id) : {};

    const formId = 'contractFormElement';
    const modalContent = document.createElement('div');
    modalContent.innerHTML = `
      <form id="${formId}" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Número do Contrato *</label>
            <input type="text" name="numeroContrato" required class="input-field" placeholder="Ex: 001/2025" value="${contract.numeroContrato || ''}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
            <input type="text" name="empresa" required class="input-field" placeholder="Nome da empresa" value="${contract.empresa || ''}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data de Início *</label>
            <input type="date" name="dataInicio" required class="input-field" value="${contract.dataInicio || ''}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento *</label>
            <input type="date" name="dataVencimento" required class="input-field" value="${contract.dataVencimento || ''}" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select name="status" required class="input-field">
              <option value="Ativo" ${contract.status === 'Ativo' ? 'selected' : ''}>Ativo</option>
              <option value="Suspenso" ${contract.status === 'Suspenso' ? 'selected' : ''}>Suspenso</option>
              <option value="Vencido" ${contract.status === 'Vencido' ? 'selected' : ''}>Vencido</option>
              <option value="Cancelado" ${contract.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3 justify-end pt-4">
          <button type="button" class="btn-secondary" data-dismiss-modal>Cancelar</button>
          <button type="submit" class="btn-primary">Salvar Contrato</button>
        </div>
      </form>
    `;

    const title = isEditing ? 'Editar Contrato' : 'Novo Contrato';
    this.openModal(title, modalContent, (modalElement) => {
      const form = modalElement.querySelector(`#${formId}`);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const contractData = Object.fromEntries(formData.entries());
        
        if (this.editingId) {
          this.stateManager.updateContract(this.editingId, contractData);
        } else {
          this.stateManager.addContract(contractData);
        }
        this.closeModal(modalElement);
      });
    });
  }

  handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.')) {
      this.stateManager.deleteContract(id);
    }
  }

  openModal(title, contentElement, onOpen) {
    const modalId = `modal-${Date.now()}`;
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300';
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-transform duration-300 scale-95">
        <div class="p-6 border-b flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-800">${title}</h3>
          <button data-dismiss-modal class="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>
        <div class="p-6"></div>
      </div>
    `;
    modal.querySelector('.p-6:last-child').appendChild(contentElement);
    document.body.appendChild(modal);
    
    // Trigger animations
    setTimeout(() => {
      modal.classList.add('opacity-100');
      modal.querySelector('.transform').classList.remove('scale-95');
      modal.querySelector('.transform').classList.add('scale-100');
    }, 10);

    modal.querySelectorAll('[data-dismiss-modal]').forEach(btn => {
      btn.addEventListener('click', () => this.closeModal(modal));
    });

    if (onOpen) {
      onOpen(modal);
    }
  }

  closeModal(modalElement) {
    modalElement.classList.remove('opacity-100');
    modalElement.querySelector('.transform').classList.add('scale-95');
    setTimeout(() => {
      modalElement.remove();
    }, 300);
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

  getDaysUntilExpiry(dateString) {
    if (!dateString) return 0;
    const [year, month, day] = dateString.split('-');
    const expiryDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = expiryDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
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
