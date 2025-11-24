import htmlDocx from 'html-to-docx';
import protocolTemplate from '../templates/protocol-template.html?raw';

export class ProtocolGenerator {
  generate(notes, despacho, secretaria) {
    const html = this.getProtocolHtml(notes, despacho, secretaria, true);

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');

    if (!printWindow) {
      URL.revokeObjectURL(url);
      alert('A janela de impressão foi bloqueada pelo seu navegador. Por favor, permita pop-ups para este site e tente novamente.');
    }
  }

  async generateWord(notes, despacho, secretaria) {
    const html = this.getProtocolHtml(notes, despacho, secretaria, false);

    const safeDespacho = despacho.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `despacho_${safeDespacho}.docx`;

    try {
      const fileBuffer = await htmlDocx(html, null, {
        orientation: 'portrait',
        margins: {
          top: 1134,
          right: 1134,
          bottom: 1134,
          left: 1134,
        }
      });

      const url = window.URL.createObjectURL(fileBuffer);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Erro ao gerar DOCX:", error);
      alert(`Erro ao gerar documento Word: ${error.message}`);
      throw error;
    }
  }

  getProtocolHtml(notes, despacho, secretaria, includePrintButton = false) {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()} de ${currentDate.toLocaleDateString('pt-BR', { month: 'long' })} de ${currentDate.getFullYear()}`;
    const totalValue = notes.reduce((sum, note) => sum + parseFloat(note.valor), 0).toFixed(2);
    // Imagem de placeholder válida para garantir que o arquivo não seja corrompido.
    const brasaoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABSSURBVHhe7cExAQAAAMKg9U9tCF8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg3wAN8AABn1n47wAAAABJRU5ErkJggg==';

    const tableBody = notes.map(note => `
      <tr>
        <td>${note.empenho}</td>
        <td class="left">${note.empresa}</td>
        <td>${note.setor}</td>
        <td>${note.numeroNota}</td>
        <td>${this.formatDate(note.dataNota)}</td>
        <td class="right">R$ ${parseFloat(note.valor).toFixed(2)}</td>
      </tr>
    `).join('');

    const totalRow = notes.length > 0 ? `
      <tr>
        <td colspan="5" class="right" style="font-weight: bold;">TOTAL:</td>
        <td class="right" style="font-weight: bold;">R$ ${totalValue}</td>
      </tr>
    ` : `
      <tr><td colspan="6">Nenhuma nota selecionada.</td></tr>
    `;

    const printButton = includePrintButton ? `<button class="print-button no-print" onclick="window.print()">🖨️ Imprimir</button>` : '';

    return protocolTemplate
      .replace('{{printButton}}', printButton)
      .replace('{{brasaoBase64}}', brasaoBase64)
      .replace('{{despacho}}', despacho)
      .replace('{{secretaria}}', secretaria)
      .replace('{{tableBody}}', tableBody)
      .replace('{{totalRow}}', totalRow)
      .replace('{{formattedDate}}', formattedDate);
  }

  generateProtocolNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900) + 100;
    return `${random}/${year}`;
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }
}
