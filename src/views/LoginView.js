export class LoginView {
  constructor(stateManager, authService, router) {
    this.stateManager = stateManager;
    this.authService = authService;
    this.router = router;
    this.error = '';
  }

  render() {
    const container = document.createElement('div');
    container.className = 'min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 px-4';
    
    container.innerHTML = `
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900">Sistema de Gestão</h2>
            <p class="text-gray-600 mt-2">Gerenciamento de Contratos e Notas</p>
          </div>

          <form id="loginForm" class="space-y-6">
            ${this.error ? `
              <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p class="text-sm text-red-700">${this.error}</p>
              </div>
            ` : ''}

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Usuário</label>
              <input 
                type="text" 
                id="usuario" 
                required
                class="input-field"
                placeholder="Digite seu usuário"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input 
                type="password" 
                id="senha" 
                required
                class="input-field"
                placeholder="Digite sua senha"
              />
            </div>

            <button type="submit" class="w-full btn-primary py-3 text-lg">
              Entrar
            </button>
          </form>

          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-600 text-center">
              <strong>Acesso padrão:</strong><br>
              Usuário: admin | Senha: admin123
            </p>
          </div>
        </div>
      </div>
    `;

    const form = container.querySelector('#loginForm');
    form.addEventListener('submit', (e) => this.handleLogin(e));

    return container;
  }

  handleLogin(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    const result = this.authService.login(usuario, senha);
    
    if (result.success) {
      this.router.navigate('dashboard');
    } else {
      this.error = result.message;
      this.router.loadView('login');
    }
  }
}
