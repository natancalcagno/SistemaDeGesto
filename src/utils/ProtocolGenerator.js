import htmlDocx from 'html-to-docx';

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
      const fileBuffer = await htmlDocx.asBlob(html, {
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
      throw error;
    }
  }

  getProtocolHtml(notes, despacho, secretaria, includePrintButton = false) {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()} de ${currentDate.toLocaleDateString('pt-BR', { month: 'long' })} de ${currentDate.getFullYear()}`;
    const totalValue = notes.reduce((sum, note) => sum + parseFloat(note.valor), 0).toFixed(2);

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Despacho do Controle Interno Nº ${despacho}</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            max-width: 21cm;
            margin: 0 auto;
            background-color: white;
          }
          
          .header { text-align: center; margin-bottom: 20px; }
          .logo { width: 80px; height: auto; margin: 0 auto 10px; }
          .header-text { font-size: 10pt; line-height: 1.3; margin-bottom: 5px; font-weight: bold; }
          .header-email { font-size: 9pt; font-weight: normal; text-decoration: underline; color: blue; }
          .title { text-align: center; font-size: 12pt; font-weight: bold; margin: 30px 0; text-decoration: underline; }
          .greeting { margin: 20px 0; }
          .content { text-align: justify; margin: 20px 0; text-indent: 4em; }
          .section-title { font-weight: bold; margin: 20px 0 10px 0; }
          
          table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9pt; border: 2px solid #000; }
          table th, table td { border: 1px solid #000; padding: 4px; text-align: center; vertical-align: middle; }
          table th { font-weight: bold; }
          table td.left { text-align: left; }
          table td.right { text-align: right; }
          
          .date-location { text-align: right; margin: 30px 0 60px 0; }
          .signatures-container { display: flex; justify-content: space-between; margin-top: 80px; font-size: 10pt; text-align: center; }
          .signature-block { width: 45%; }
          .signature-line { border-top: 1px solid #000; width: 100%; margin: 0 auto 5px; }
          .receipt-footer { margin-top: 80px; text-align: center; font-size: 11pt; }
          .receipt-line { border-top: 1px solid #000; width: 350px; margin: 0 auto 10px; }
          .red-text { color: red; }
          
          .print-button {
            position: fixed; top: 20px; right: 20px; padding: 12px 24px; background-color: #2563eb;
            color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;
            font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 100;
          }
          .print-button:hover { background-color: #1d4ed8; }

          @media print {
            body { padding: 0; }
            .no-print { display: none; }
            .header-email, .red-text {
              -webkit-print-color-adjust: exact; 
              color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        ${includePrintButton ? `<button class="print-button no-print" onclick="window.print()">🖨️ Imprimir</button>` : ''}
        
        <div class="header">
          <img src="https://i.ibb.co/d0SP0g7/brasao.png" alt="Brasão do Estado do Pará" class="logo" />
          <div class="header-text">
            ESTADO DO PARÁ<br>
            PREFEITURA MUNICIPAL DE CASTANHAL<br>
            COORDENADORIA DE CONTROLE INTERNO<br>
            <span class="header-email">e-mail: controleinternocastanhal@gmail.com</span>
          </div>
        </div>
        
        <div class="title">
          DESPACHO DO CONTROLE INTERNO Nº ${despacho}
        </div>
        
        <div class="greeting">
          Ilmo. Srª.<br>
          <strong class="red-text">${secretaria},</strong>
        </div>
        
        <div class="content">
          Em atenção à solicitação de manifestação, desta Coordenadoria de Controle Interno do Município quanto à legalidade do pagamento da referida despesa, tal como descrito nas Ordens de Fornecimentos e, fundamentando-se nos artigos 62 e seguintes da Lei nº 4.320/64 que discorre sobre pagamento de despesas, assim como a sua regular liquidação, manifesta-se que:
        </div>
        
        <div class="section-title">1. DO RELATÓRIO</div>
        
        <div class="content">
          Este Controle Interno promoveu a análise documental quanto ao prosseguimento da despesa abaixo descrita, considerando a documentação acostada, a verificação do direito adquirido pelo(s) prestador(es), tendo por base os títulos e documentos comprobatórios do respectivo crédito, apurando a origem, o objeto, a importância exata a ser paga, constatando o cumprimento do objeto através da juntada da <strong>Notas Fiscais</strong> (devidamente atestada pelos fiscais do contrato e <strong>Notas de Empenho</strong>, cabendo assim o prosseguimento do feito e efetivo pagamento visto o cumprimento dos ditames legais.
        </div>
        
        <div style="text-align: center; font-weight: bold; margin-top: 20px;">PLANILHA DE PAGAMENTO:</div>
        
        <table>
          <thead>
            <tr>
              <th>EMPENHO</th>
              <th>EMPRESA</th>
              <th>UNID.<br>ORÇ</th>
              <th>NF</th>
              <th>DATA NF</th>
              <th>VALOR</th>
            </tr>
          </thead>
          <tbody>
            ${notes.map(note => `
              <tr>
                <td>${note.empenho}</td>
                <td class="left">${note.empresa}</td>
                <td>${note.setor}</td>
                <td>${note.numeroNota}</td>
                <td>${this.formatDate(note.dataNota)}</td>
                <td class="right">R$ ${parseFloat(note.valor).toFixed(2)}</td>
              </tr>
            `).join('')}
            ${notes.length > 0 ? `
              <tr>
                <td colspan="5" class="right" style="font-weight: bold;">TOTAL:</td>
                <td class="right" style="font-weight: bold;">R$ ${totalValue}</td>
              </tr>
            ` : `
              <tr><td colspan="6">Nenhuma nota selecionada.</td></tr>
            `}
          </tbody>
        </table>
        
        <div class="date-location">
          Castanhal (PA), <span class="red-text">${formattedDate}</span>.
        </div>
        
        <div class="signatures-container">
          <div class="signature-block">
            <div class="signature-line"></div>
            Helton J. de S. Trajano da S. Teles<br>
            Coordenador de Controle Interno do Município<br>
            Portaria n°279/2025
          </div>
          <div class="signature-block">
            <div class="signature-line"></div>
            <span class="red-text">XXXXXXXXXXXXXX</span><br>
            Contador<br>
            <span class="red-text">CRC/XXXXXXXXXX</span>
          </div>
        </div>
        
        <div class="receipt-footer">
          <div class="receipt-line"></div>
          <strong>RECEBIMENTO PELA SECRETARIA</strong>
        </div>
      </body>
      </html>
    `;
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
    return date.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
  }
}
