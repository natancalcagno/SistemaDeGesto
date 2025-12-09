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
      // Clean up HTML to avoid issues with html-to-docx
      const cleanHtml = html.replace(/>\s+</g, '><').trim();

      const fileBuffer = await htmlDocx(cleanHtml, null, {
        orientation: 'portrait',
        margins: {
          top: 1134,
          right: 1134,
          bottom: 1134,
          left: 1134,
        }
      });

      let blob;
      if (fileBuffer instanceof Blob) {
        blob = fileBuffer;
      } else {
        // Ensure we are using the ArrayBuffer from the Buffer polyfill
        const arrayBuffer = fileBuffer.buffer || fileBuffer;
        blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      }

      const url = window.URL.createObjectURL(blob);
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
    // For Word generation (when includePrintButton is false), use simplified HTML
    if (!includePrintButton) {
      const totalValue = notes.reduce((sum, note) => sum + parseFloat(note.valor), 0).toFixed(2);
      const tableRows = notes.map(note => `
        <tr>
          <td>${note.empenho}</td>
          <td>${note.empresa}</td>
          <td>${note.setor}</td>
          <td>${note.numeroNota}</td>
          <td>${this.formatDate(note.dataNota)}</td>
          <td>R$ ${parseFloat(note.valor).toFixed(2)}</td>
        </tr>
      `).join('');

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Despacho ${despacho}</title>
        </head>
        <body>
          <h1>DESPACHO DO CONTROLE INTERNO Nº ${despacho}</h1>
          <p><strong>${secretaria}</strong></p>
          <table border="1">
            <thead>
              <tr>
                <th>EMPENHO</th>
                <th>EMPRESA</th>
                <th>SETOR</th>
                <th>NF</th>
                <th>DATA NF</th>
                <th>VALOR</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              <tr>
                <td colspan="5"><strong>TOTAL:</strong></td>
                <td><strong>R$ ${totalValue}</strong></td>
              </tr>
            </tbody>
          </table>
        </body>
        </html>
      `;
    }

    // For print/preview (when includePrintButton is true), use full template
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()} de ${currentDate.toLocaleDateString('pt-BR', { month: 'long' })} de ${currentDate.getFullYear()}`;
    const totalValue = notes.reduce((sum, note) => sum + parseFloat(note.valor), 0).toFixed(2);
    const brasaoBase64 = 'data:image/png;base64,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';

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

    const printButton = `<button class="print-button no-print" onclick="window.print()">🖨️ Imprimir</button>`;

    return protocolTemplate
      .replace('{{printButton}}', printButton)
      .replace('{{brasaoBase64}}', brasaoBase64)
      .replaceAll('{{despacho}}', despacho)
      .replaceAll('{{secretaria}}', secretaria)
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
