import './style.css';
import { StateManager } from './src/state/StateManager.js';
import { Router } from './src/router/Router.js';
import { AuthService } from './src/services/AuthService.js';

class App {
  constructor() {
    this.stateManager = new StateManager();
    this.authService = new AuthService(this.stateManager);
    this.router = new Router(this.stateManager, this.authService);
    
    this.init();
  }

  init() {
    this.router.init();
    this.checkAuthentication();
  }

  checkAuthentication() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate('login');
    } else {
      const currentRoute = window.location.hash.slice(1) || 'dashboard';
      if (currentRoute === 'login') {
        this.router.navigate('dashboard');
      }
    }
  }
}

new App();
