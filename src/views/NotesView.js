import { Layout } from '../components/Layout.js';
import { ProtocolGenerator } from '../utils/ProtocolGenerator.js';

export class NotesView {
  constructor(stateManager, authService, router) {
    this.stateManager = stateManager;
    this.authService = authService;
    this.router = router;
    this.editingId = null;
    this.selectedNotes = new Set();
    this.protocolGenerator = new ProtocolGenerator();

    this.stateManager.subscribe('notesUpdated', () => {
      this.router.loadView('notes');
    });
  }

  render() {
    const layout = new Layout(this.authService, this.router, 'notes');
    const content = this.renderContent();
    return layout.render(content);
  }

  renderContent() {
    const notes = this.stateManager.getNotes();

    const container = document.createElement('div');
    container.className = 'space-y-6';

    container.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Notas Fiscais</h1>
          <p class="text-gray-600 mt-1">Gerencie todas as notas fiscais</p>
        </div>
        <div class="flex gap-3">
          ${this.selectedNotes.size > 0 ? `
            <button id="generateProtocolBtn" class="btn-primary">
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Gerar Protocolo (${this.selectedNotes.size})
            </button>
          ` : ''}
          <button id="addNoteBtn" class="btn-primary">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nova Nota
          </button>
        </div>
      </div>

      <div id="noteForm" class="card hidden">
        <h3 class="text-lg font-semibold text-gray-900 mb-4" id="formTitle">Nova Nota Fiscal</h3>
        <form id="noteFormElement" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data de Entrada *</label>
              <input type="date" id="dataEntrada" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Empenho *</label>
              <input type="text" id="empenho" required class="input-field" placeholder="Ex: 001/2025" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
              <input type="text" id="empresa" required class="input-field" placeholder="Nome da empresa" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Setor *</label>
              <input type="text" id="setor" required class="input-field" placeholder="Ex: Secretaria de Saúde" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Número da Nota *</label>
              <input type="text" id="numeroNota" required class="input-field" placeholder="Ex: 12345" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data da Nota *</label>
              <input type="date" id="dataNota" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
              <input type="number" id="valor" required step="0.01" class="input-field" placeholder="0.00" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data de Saída</label>
              <input type="date" id="dataSaida" class="input-field" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea id="observacao" rows="3" class="input-field" placeholder="Adicione observações..."></textarea>
          </div>
          <div class="flex gap-3 justify-end pt-4">
            <button type="button" id="cancelBtn" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar</button>
          </div>
        </form>
      </div>

      <div class="card">
        ${notes.length > 0 ? `
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-center py-3 px-2 w-12">
                    <input type="checkbox" id="selectAll" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Empenho</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Empresa</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Setor</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">NF</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Data NF</th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Valor</th>
                  <th class="text-center py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${notes.map(note => `
                  <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="text-center py-3 px-2">
                      <input type="checkbox" class="note-checkbox rounded border-gray-300 text-primary-600 focus:ring-primary-500" data-id="${note.id}" ${this.selectedNotes.has(note.id) ? 'checked' : ''} />
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-700">${note.empenho}</td>
                    <td class="py-3 px-4 text-sm text-gray-700">${note.empresa}</td>
                    <td class="py-3 px-4 text-sm text-gray-700">${note.setor}</td>
                    <td class="py-3 px-4 text-sm font-medium text-gray-900">${note.numeroNota}</td>
                    <td class="py-3 px-4 text-sm text-gray-700">${this.formatDate(note.dataNota)}</td>
                    <td class="py-3 px-4 text-sm font-medium text-gray-900">R$ ${parseFloat(note.valor).toFixed(2)}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center justify-center gap-2">
                        <button class="edit-btn p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" data-id="${note.id}">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button class="delete-btn p-2 text-red-600 hover:bg-red-50 rounded transition-colors" data-id="${note.id}">
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
            <p class="text-gray-500">Nenhuma nota fiscal cadastrada</p>
            <button onclick="document.getElementById('addNoteBtn').click()" class="mt-4 text-primary-600 hover:text-primary-700 font-medium">
              Cadastrar primeira nota
            </button>
          </div>
        `}
      </div>
    `;

    this.attachEventListeners(container);
    return container;
  }

  attachEventListeners(container) {
    const addBtn = container.querySelector('#addNoteBtn');
    const form = container.querySelector('#noteFormElement');
    const cancelBtn = container.querySelector('#cancelBtn');
    const formContainer = container.querySelector('#noteForm');
    const generateProtocolBtn = container.querySelector('#generateProtocolBtn');
    const selectAllCheckbox = container.querySelector('#selectAll');

    addBtn?.addEventListener('click', () => {
      this.editingId = null;
      form.reset();
      container.querySelector('#formTitle').textContent = 'Nova Nota Fiscal';
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

    generateProtocolBtn?.addEventListener('click', () => {
      this.showProtocolModal();
    });

    selectAllCheckbox?.addEventListener('change', (e) => {
      const checkboxes = container.querySelectorAll('.note-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = e.target.checked;
        const id = parseInt(cb.dataset.id);
        if (e.target.checked) {
          this.selectedNotes.add(id);
        } else {
          this.selectedNotes.delete(id);
        }
      });
      this.router.loadView('notes');
    });

    container.querySelectorAll('.note-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const id = parseInt(e.target.dataset.id);
        if (e.target.checked) {
          this.selectedNotes.add(id);
        } else {
          this.selectedNotes.delete(id);
        }
        this.router.loadView('notes');
      });
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
    const noteData = {
      dataEntrada: form.querySelector('#dataEntrada').value,
      empenho: form.querySelector('#empenho').value,
      empresa: form.querySelector('#empresa').value,
      setor: form.querySelector('#setor').value,
      numeroNota: form.querySelector('#numeroNota').value,
      dataNota: form.querySelector('#dataNota').value,
      valor: form.querySelector('#valor').value,
      dataSaida: form.querySelector('#dataSaida').value,
      observacao: form.querySelector('#observacao').value,
    };

    if (this.editingId) {
      this.stateManager.updateNote(this.editingId, noteData);
    } else {
      this.stateManager.addNote(noteData);
    }

    form.reset();
    formContainer.classList.add('hidden');
    this.editingId = null;
  }

  handleEdit(id, formContainer, form) {
    const notes = this.stateManager.getNotes();
    const note = notes.find(n => n.id === id);
    
    if (note) {
      this.editingId = id;
      form.querySelector('#dataEntrada').value = note.dataEntrada;
      form.querySelector('#empenho').value = note.empenho;
      form.querySelector('#empresa').value = note.empresa;
      form.querySelector('#setor').value = note.setor;
      form.querySelector('#numeroNota').value = note.numeroNota;
      form.querySelector('#dataNota').value = note.dataNota;
      form.querySelector('#valor').value = note.valor;
      form.querySelector('#dataSaida').value = note.dataSaida || '';
      form.querySelector('#observacao').value = note.observacao || '';
      
      document.querySelector('#formTitle').textContent = 'Editar Nota Fiscal';
      formContainer.classList.remove('hidden');
      formContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
      this.stateManager.deleteNote(id);
      this.selectedNotes.delete(id);
    }
  }

  showProtocolModal() {
    const notes = this.stateManager.getNotes();
    const selectedNotesList = notes.filter(note => this.selectedNotes.has(note.id));
    
    if (selectedNotesList.length === 0) {
      alert('Selecione pelo menos uma nota fiscal para gerar o protocolo');
      return;
    }

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'protocolModal';
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4';
    
    const defaultDispatchNumber = this.protocolGenerator.generateProtocolNumber();
    const defaultSecretary = 'Secretária Municipal de Assistência Social';

    modalOverlay.innerHTML = `
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        <div class="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h3 class="text-xl font-bold text-gray-800">Gerar Protocolo de Entrega</h3>
          <button id="closeModalBtn" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <div class="flex-grow flex flex-col md:flex-row overflow-hidden">
          <div class="w-full md:w-1/3 p-4 border-r overflow-y-auto space-y-4 bg-gray-50">
            <h4 class="font-semibold text-gray-700">Personalizar Documento</h4>
            <div>
              <label for="despachoInput" class="block text-sm font-medium text-gray-700 mb-1">Número do Despacho</label>
              <input type="text" id="despachoInput" value="${defaultDispatchNumber}" class="input-field">
            </div>
            <div>
              <label for="secretariaInput" class="block text-sm font-medium text-gray-700 mb-1">Secretaria de Destino</label>
              <input type="text" id="secretariaInput" value="${defaultSecretary}" class="input-field">
            </div>
          </div>
          <div class="w-full md:w-2/3 bg-gray-200 overflow-y-auto p-4 flex-grow">
            <iframe id="previewFrame" class="w-full h-full border-0 bg-white shadow-inner rounded-md"></iframe>
          </div>
        </div>
        <div class="p-4 border-t flex justify-end gap-3 flex-shrink-0 bg-gray-50">
          <button id="cancelPrintBtn" class="btn-secondary">Cancelar</button>
          <button id="downloadWordBtn" class="btn-secondary flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Baixar Word
          </button>
          <button id="confirmPrintBtn" class="btn-primary">Imprimir</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    const despachoInput = document.getElementById('despachoInput');
    const secretariaInput = document.getElementById('secretariaInput');
    const previewFrame = document.getElementById('previewFrame');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelPrintBtn = document.getElementById('cancelPrintBtn');
    const confirmPrintBtn = document.getElementById('confirmPrintBtn');
    const downloadWordBtn = document.getElementById('downloadWordBtn');

    const updatePreview = () => {
      const despacho = despachoInput.value;
      const secretaria = secretariaInput.value;
      const protocolHtml = this.protocolGenerator.getProtocolHtml(selectedNotesList, despacho, secretaria);
      previewFrame.srcdoc = protocolHtml;
    };

    despachoInput.addEventListener('input', updatePreview);
    secretariaInput.addEventListener('input', updatePreview);

    const closeModal = () => {
      document.body.removeChild(modalOverlay);
    };

    closeModalBtn.addEventListener('click', closeModal);
    cancelPrintBtn.addEventListener('click', closeModal);

    confirmPrintBtn.addEventListener('click', () => {
      const despacho = despachoInput.value;
      const secretaria = secretariaInput.value;
      this.protocolGenerator.generate(selectedNotesList, despacho, secretaria);
      closeModal();
    });

    downloadWordBtn.addEventListener('click', async () => {
      const despacho = despachoInput.value;
      const secretaria = secretariaInput.value;
      
      downloadWordBtn.disabled = true;
      downloadWordBtn.textContent = 'Gerando...';

      try {
        await this.protocolGenerator.generateWord(selectedNotesList, despacho, secretaria);
      } catch (error) {
        console.error('Erro ao gerar documento Word:', error);
        alert('Ocorreu um erro ao gerar o documento Word.');
      } finally {
        downloadWordBtn.disabled = false;
        downloadWordBtn.innerHTML = `
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Baixar Word
        `;
      }
    });

    updatePreview();
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
  }

  destroy() {
  }
}
