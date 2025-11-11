import { LoginView } from '../views/LoginView.js';
import { DashboardView } from '../views/DashboardView.js';
import { ContractsView } from '../views/ContractsView.js';
import { NotesView } from '../views/NotesView.js';
import { UsersView } from '../views/UsersView.js';
import { ReportsView } from '../views/ReportsView.js';

export class Router {
  constructor(stateManager, authService) {
    this.stateManager = stateManager;
    this.authService = authService;
    this.routes = {
      login: LoginView,
      dashboard: DashboardView,
      contracts: ContractsView,
      notes: NotesView,
      users: UsersView,
      reports: ReportsView,
    };
    this.viewCache = {};
    this.currentView = null;

    this.stateManager.subscribe('logout', () => this.clearCache());
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    
    if (hash !== 'login' && !this.authService.isAuthenticated()) {
      this.navigate('login');
      return;
    }

    this.loadView(hash);
  }

  loadView(viewName) {
    const ViewClass = this.routes[viewName];
    
    if (ViewClass) {
      if (!this.viewCache[viewName]) {
        this.viewCache[viewName] = new ViewClass(this.stateManager, this.authService, this);
      }
      this.currentView = this.viewCache[viewName];
      
      const app = document.getElementById('app');
      app.innerHTML = '';
      app.appendChild(this.currentView.render());
    }
  }

  navigate(route) {
    window.location.hash = route;
  }

  clearCache() {
    this.viewCache = {};
  }
}
