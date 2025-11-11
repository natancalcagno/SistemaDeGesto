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
          <h1 class="text-3xl font-bold text-gray-900">Gerenciamento de Notas Fiscais</h1>
          <p class="text-gray-600 mt-1">Adicione, edite e gere protocolos de entrega.</p>
        </div>
        <div class="flex gap-3">
          <button id="generateProtocolBtn" class="btn-primary flex items-center justify-center gap-2" ${this.selectedNotes.size === 0 ? 'disabled' : ''}>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Gerar Protocolo (${this.selectedNotes.size})
          </button>
          <button id="addNoteBtn" class="btn-primary flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
            Nova Nota
          </button>
        </div>
      </div>

      <div id="noteFormContainer"></div>

      <div class="card">
        ${notes.length > 0 ? `
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th class="p-4 w-12 text-center">
                    <input type="checkbox" id="selectAll" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  </th>
                  <th class="p-4 font-semibold">Empenho</th>
                  <th class="p-4 font-semibold">Empresa</th>
                  <th class="p-4 font-semibold">Setor</th>
                  <th class="p-4 font-semibold">NF</th>
                  <th class="p-4 font-semibold">Data NF</th>
                  <th class="p-4 font-semibold">Valor</th>
                  <th class="p-4 font-semibold text-center">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${notes.map(note => `
                  <tr class="hover:bg-gray-50">
                    <td class="p-4 text-center">
                      <input type="checkbox" class="note-checkbox rounded border-gray-300 text-primary-600 focus:ring-primary-500" data-id="${note.id}" ${this.selectedNotes.has(note.id) ? 'checked' : ''} />
                    </td>
                    <td class="p-4 text-gray-700">${note.empenho}</td>
                    <td class="p-4 text-gray-700">${note.empresa}</td>
                    <td class="p-4 text-gray-700">${note.setor}</td>
                    <td class="p-4 font-medium text-gray-900">${note.numeroNota}</td>
                    <td class="p-4 text-gray-700">${this.formatDate(note.dataNota)}</td>
                    <td class="p-4 font-medium text-gray-900">R$ ${parseFloat(note.valor).toFixed(2)}</td>
                    <td class="p-4">
                      <div class="flex items-center justify-center gap-2">
                        <button class="edit-btn p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" data-id="${note.id}" title="Editar">
                           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                        </button>
                        <button class="delete-btn p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors" data-id="${note.id}" title="Excluir">
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
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
            <h3 class="text-lg font-semibold text-gray-800">Nenhuma nota fiscal cadastrada</h3>
            <p class="text-gray-500 mt-1">Comece adicionando uma nova nota.</p>
            <button onclick="document.getElementById('addNoteBtn').click()" class="mt-4 btn-primary">
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
    container.querySelector('#addNoteBtn')?.addEventListener('click', () => this.showFormModal());
    container.querySelector('#generateProtocolBtn')?.addEventListener('click', () => this.showProtocolModal());

    container.querySelector('#selectAll')?.addEventListener('change', (e) => {
      container.querySelectorAll('.note-checkbox').forEach(cb => {
        cb.checked = e.target.checked;
        const id = parseInt(cb.dataset.id);
        e.target.checked ? this.selectedNotes.add(id) : this.selectedNotes.delete(id);
      });
      this.router.loadView('notes');
    });

    container.querySelectorAll('.note-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const id = parseInt(e.target.dataset.id);
        e.target.checked ? this.selectedNotes.add(id) : this.selectedNotes.delete(id);
        this.router.loadView('notes');
      });
    });

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
    const note = isEditing ? this.stateManager.getNotes().find(n => n.id === id) : {};

    const formId = 'noteFormElement';
    const modalContent = document.createElement('div');
    modalContent.innerHTML = `
      <form id="${formId}" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data de Entrada *</label>
            <input type="date" name="dataEntrada" required class="input-field" value="${note.dataEntrada || ''}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Empenho *</label>
            <input type="text" name="empenho" required class="input-field" placeholder="Ex: 001/2025" value="${note.empenho || ''}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
            <input type="text" name="empresa" required class="input-field" placeholder="Nome da empresa" value="${note.empresa || ''}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Setor *</label>
            <input type="text" name="setor" required class="input-field" placeholder="Ex: Secretaria de Saúde" value="${note.setor || ''}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Número da Nota *</label>
            <input type="text" name="numeroNota" required class="input-field" placeholder="Ex: 12345" value="${note.numeroNota || ''}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data da Nota *</label>
            <input type="date" name="dataNota" required class="input-field" value="${note.dataNota || ''}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
            <input type="number" name="valor" required step="0.01" class="input-field" placeholder="0.00" value="${note.valor || ''}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data de Saída</label>
            <input type="date" name="dataSaida" class="input-field" value="${note.dataSaida || ''}" />
          </div>
          <div class="lg:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea name="observacao" rows="3" class="input-field" placeholder="Adicione observações...">${note.observacao || ''}</textarea>
          </div>
        </div>
        <div class="flex gap-3 justify-end pt-4">
          <button type="button" class="btn-secondary" data-dismiss-modal>Cancelar</button>
          <button type="submit" class="btn-primary">Salvar Nota</button>
        </div>
      </form>
    `;

    const title = isEditing ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal';
    this.openModal(title, modalContent, (modalElement) => {
      const form = modalElement.querySelector(`#${formId}`);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const noteData = Object.fromEntries(formData.entries());
        
        if (this.editingId) {
          this.stateManager.updateNote(this.editingId, noteData);
        } else {
          this.stateManager.addNote(noteData);
        }
        this.closeModal(modalElement);
      });
    });
  }

  handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
      this.stateManager.deleteNote(id);
      this.selectedNotes.delete(id);
    }
  }
  
  openModal(title, contentElement, onOpen) {
    const modalId = `modal-${Date.now()}`;
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300';
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-transform duration-300 scale-95">
        <div class="p-6 border-b flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-800">${title}</h3>
          <button data-dismiss-modal class="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>
        <div class="p-6"></div>
      </div>
    `;
    modal.querySelector('.p-6:last-child').appendChild(contentElement);
    document.body.appendChild(modal);
    
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

  showProtocolModal() {
    const notes = this.stateManager.getNotes();
    const selectedNotesList = notes.filter(note => this.selectedNotes.has(note.id));
    
    if (selectedNotesList.length === 0) {
      alert('Selecione pelo menos uma nota fiscal para gerar o protocolo.');
      return;
    }

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'protocolModal';
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4';
    
    const defaultDispatchNumber = this.protocolGenerator.generateProtocolNumber();
    const defaultSecretary = 'Secretária Municipal de Assistência Social';

    modalOverlay.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col transform transition-transform duration-300 scale-95">
        <div class="p-5 border-b flex justify-between items-center flex-shrink-0">
          <h3 class="text-xl font-bold text-gray-800">Gerar Protocolo de Entrega</h3>
          <button id="closeModalBtn" class="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>
        <div class="flex-grow flex flex-col md:flex-row overflow-hidden">
          <div class="w-full md:w-1/3 p-6 border-r overflow-y-auto space-y-6 bg-gray-50">
            <h4 class="font-semibold text-gray-800 text-lg">Personalizar Documento</h4>
            <div>
              <label for="despachoInput" class="block text-sm font-medium text-gray-700 mb-1">Número do Despacho</label>
              <input type="text" id="despachoInput" value="${defaultDispatchNumber}" class="input-field">
            </div>
            <div>
              <label for="secretariaInput" class="block text-sm font-medium text-gray-700 mb-1">Secretaria de Destino</label>
              <input type="text" id="secretariaInput" value="${defaultSecretary}" class="input-field">
            </div>
          </div>
          <div class="w-full md:w-2/3 bg-gray-200 overflow-y-auto p-6 flex-grow">
            <iframe id="previewFrame" class="w-full h-full border-0 bg-white shadow-inner rounded-md"></iframe>
          </div>
        </div>
        <div class="p-4 border-t flex flex-wrap justify-end gap-3 flex-shrink-0 bg-gray-100">
          <button id="cancelPrintBtn" class="btn-secondary">Cancelar</button>
          <button id="downloadWordBtn" class="btn-secondary flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Baixar Word
          </button>
          <button id="confirmPrintBtn" class="btn-primary flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Imprimir
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);
    
    setTimeout(() => {
      modalOverlay.querySelector('.transform').classList.remove('scale-95');
      modalOverlay.querySelector('.transform').classList.add('scale-100');
    }, 10);

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
      const modal = document.getElementById('protocolModal');
      if (modal) {
        modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => modal.remove(), 300);
      }
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
      downloadWordBtn.innerHTML = 'Gerando...';

      try {
        await this.protocolGenerator.generateWord(selectedNotesList, despacho, secretaria);
      } catch (error) {
        console.error('Erro ao gerar documento Word:', error);
        alert('Ocorreu um erro ao gerar o documento Word.');
      } finally {
        downloadWordBtn.disabled = false;
        downloadWordBtn.innerHTML = `
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
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
}
