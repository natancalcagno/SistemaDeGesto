export class AuthService {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  login(usuario, senha) {
    const users = this.stateManager.getUsers();
    const user = users.find(u => u.usuario === usuario && u.senha === senha);
    
    if (user) {
      this.stateManager.setCurrentUser(user);
      return { success: true, user };
    }
    
    return { success: false, message: 'Usuário ou senha inválidos' };
  }

  logout() {
    this.stateManager.clearCurrentUser();
    this.stateManager.emit('logout');
  }

  getCurrentUser() {
    return this.stateManager.getCurrentUser();
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
}
