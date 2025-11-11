export class StateManager {
  constructor() {
    this.listeners = {};
    this.loadData();
  }

  loadData() {
    this.data = {
      users: JSON.parse(localStorage.getItem('users') || '[]'),
      contracts: JSON.parse(localStorage.getItem('contracts') || '[]'),
      notes: JSON.parse(localStorage.getItem('notes') || '[]'),
      currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
    };

    if (this.data.users.length === 0) {
      this.data.users.push({
        id: 1,
        nome: 'Administrador',
        email: 'admin@sistema.com',
        usuario: 'admin',
        senha: 'admin123',
        tipo: 'Administrador'
      });
      this.saveUsers();
    }
  }

  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  getUsers() {
    return this.data.users;
  }

  addUser(user) {
    user.id = Date.now();
    this.data.users.push(user);
    this.saveUsers();
    this.emit('usersUpdated', this.data.users);
  }

  saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.data.users));
  }

  getContracts() {
    return this.data.contracts;
  }

  addContract(contract) {
    contract.id = Date.now();
    this.data.contracts.push(contract);
    this.saveContracts();
    this.emit('contractsUpdated', this.data.contracts);
  }

  updateContract(id, updatedContract) {
    const index = this.data.contracts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.data.contracts[index] = { ...this.data.contracts[index], ...updatedContract };
      this.saveContracts();
      this.emit('contractsUpdated', this.data.contracts);
    }
  }

  deleteContract(id) {
    this.data.contracts = this.data.contracts.filter(c => c.id !== id);
    this.saveContracts();
    this.emit('contractsUpdated', this.data.contracts);
  }

  saveContracts() {
    localStorage.setItem('contracts', JSON.stringify(this.data.contracts));
  }

  getNotes() {
    return this.data.notes;
  }

  addNote(note) {
    note.id = Date.now();
    this.data.notes.push(note);
    this.saveNotes();
    this.emit('notesUpdated', this.data.notes);
  }

  updateNote(id, updatedNote) {
    const index = this.data.notes.findIndex(n => n.id === id);
    if (index !== -1) {
      this.data.notes[index] = { ...this.data.notes[index], ...updatedNote };
      this.saveNotes();
      this.emit('notesUpdated', this.data.notes);
    }
  }

  deleteNote(id) {
    this.data.notes = this.data.notes.filter(n => n.id !== id);
    this.saveNotes();
    this.emit('notesUpdated', this.data.notes);
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.data.notes));
  }

  setCurrentUser(user) {
    this.data.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser() {
    return this.data.currentUser;
  }

  clearCurrentUser() {
    this.data.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
