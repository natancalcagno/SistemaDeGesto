import { Layout } from '../components/Layout.js';

export class UsersView {
  constructor(stateManager, authService, router) {
    this.stateManager = stateManager;
    this.authService = authService;
    this.router = router;
    this.editingId = null;

    this.stateManager.subscribe('usersUpdated', () => {
      this.router.loadView('users');
    });
  }

  render() {
    const layout = new Layout(this.authService, this.router, 'users');
    const content = this.renderContent();
    return layout.render(content);
  }

  renderContent() {
    const users = this.stateManager.getUsers();

    const container = document.createElement('div');
    container.className = 'space-y-6';

    container.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Usuários</h1>
          <p class="text-gray-600 mt-1">Gerencie os usuários do sistema</p>
        </div>
        <button id="addUserBtn" class="btn-primary">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Novo Usuário
        </button>
      </div>

      <div id="userForm" class="card hidden">
        <h3 class="text-lg font-semibold text-gray-900 mb-4" id="formTitle">Novo Usuário</h3>
        <form id="userFormElement" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
              <input type="text" id="nome" required class="input-field" placeholder="Nome completo" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" id="email" required class="input-field" placeholder="email@exemplo.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Usuário *</label>
              <input type="text" id="usuario" required class="input-field" placeholder="nome.usuario" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
              <input type="password" id="senha" required class="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuário *</label>
              <select id="tipo" required class="input-field">
                <option value="Administrador">Administrador</option>
                <option value="Operador">Operador</option>
                <option value="Visualizador">Visualizador</option>
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
        ${users.length > 0 ? `
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nome</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Usuário</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
                  <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(user => `
                  <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4 text-sm font-medium text-gray-900">${user.nome}</td>
                    <td class="py-3 px-4 text-sm text-gray-700">${user.email}</td>
                    <td class="py-3 px-4 text-sm text-gray-700">${user.usuario}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getTipoClass(user.tipo)}">
                        ${user.tipo}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center justify-center gap-2">
                        <button class="edit-btn p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" data-id="${user.id}">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p class="text-gray-500">Nenhum usuário adicional cadastrado</p>
          </div>
        `}
      </div>
    `;

    this.attachEventListeners(container);
    return container;
  }

  attachEventListeners(container) {
    const addBtn = container.querySelector('#addUserBtn');
    const form = container.querySelector('#userFormElement');
    const cancelBtn = container.querySelector('#cancelBtn');
    const formContainer = container.querySelector('#userForm');

    addBtn?.addEventListener('click', () => {
      this.editingId = null;
      form.reset();
      container.querySelector('#formTitle').textContent = 'Novo Usuário';
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
  }

  handleSubmit(form, formContainer) {
    const userData = {
      nome: form.querySelector('#nome').value,
      email: form.querySelector('#email').value,
      usuario: form.querySelector('#usuario').value,
      senha: form.querySelector('#senha').value,
      tipo: form.querySelector('#tipo').value,
    };

    if (this.editingId) {
      this.stateManager.updateUser(this.editingId, userData);
    } else {
      this.stateManager.addUser(userData);
    }

    form.reset();
    formContainer.classList.add('hidden');
    this.editingId = null;
  }

  handleEdit(id, formContainer, form) {
    const users = this.stateManager.getUsers();
    const user = users.find(u => u.id === id);
    
    if (user) {
      this.editingId = id;
      form.querySelector('#nome').value = user.nome;
      form.querySelector('#email').value = user.email;
      form.querySelector('#usuario').value = user.usuario;
      form.querySelector('#senha').value = user.senha;
      form.querySelector('#tipo').value = user.tipo;
      
      document.querySelector('#formTitle').textContent = 'Editar Usuário';
      formContainer.classList.remove('hidden');
      formContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getTipoClass(tipo) {
    const classes = {
      'Administrador': 'bg-purple-100 text-purple-800',
      'Operador': 'bg-blue-100 text-blue-800',
      'Visualizador': 'bg-gray-100 text-gray-800'
    };
    return classes[tipo] || 'bg-gray-100 text-gray-800';
  }

  destroy() {
  }
}
