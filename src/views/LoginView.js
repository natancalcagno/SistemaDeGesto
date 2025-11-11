export class LoginView {
  constructor(stateManager, authService, router) {
    this.stateManager = stateManager;
    this.authService = authService;
    this.router = router;
    this.error = '';
  }

  render() {
    const container = document.createElement('div');
    container.className = 'min-h-screen flex items-center justify-center bg-gray-100 px-4';
    
    container.innerHTML = `
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center">
            <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 class="ml-3 text-4xl font-bold text-gray-800">Sistema de Gestão</h1>
          </div>
          <p class="text-gray-500 mt-2">Gerenciamento de Contratos e Notas Fiscais</p>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8">
          <form id="loginForm" class="space-y-6">
            <h2 class="text-2xl font-semibold text-center text-gray-700">Bem-vindo de volta!</h2>
            
            ${this.error ? `
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <span class="block sm:inline">${this.error}</span>
              </div>
            ` : ''}

            <div>
              <label for="usuario" class="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
              <input 
                type="text" 
                id="usuario" 
                required
                class="input-field"
                placeholder="Digite seu usuário"
              />
            </div>

            <div>
              <label for="senha" class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                id="senha" 
                required
                class="input-field"
                placeholder="Digite sua senha"
              />
            </div>

            <button type="submit" class="w-full btn-primary py-3 text-lg font-bold">
              Entrar
            </button>
          </form>

          <div class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p class="text-xs text-gray-600 text-center">
              <strong>Acesso padrão:</strong><br>
              Usuário: <code>admin</code> | Senha: <code>admin123</code>
            </p>
          </div>
        </div>
        <p class="text-center text-gray-500 text-xs mt-6">
          &copy;2025 Sistema de Gestão. Todos os direitos reservados.
        </p>
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
