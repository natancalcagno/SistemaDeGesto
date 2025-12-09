import { Layout } from '../components/Layout.js';
import Chart from 'chart.js/auto';

export class ReportsView {
  constructor(stateManager, authService, router) {
    this.stateManager = stateManager;
    this.authService = authService;
    this.router = router;
    this.charts = {};
  }

  render() {
    const layout = new Layout(this.authService, this.router, 'reports');
    const content = this.renderContent();
    const container = layout.render(content);

    // We need to wait for the DOM to be updated before rendering charts
    // Since layout.render returns a DOM element, we can append it and then render charts
    // But usually we return the element to be appended by the router/app
    // So we'll use a small timeout or requestAnimationFrame to ensure DOM is ready
    // Or better, we attach the charts after the element is returned.
    // However, the router likely appends the result of render(). 
    // We can use a MutationObserver or just a setTimeout(0).

    setTimeout(() => {
      this.renderCharts();
      this.attachEventListeners(container);
    }, 0);

    return container;
  }

  renderContent() {
    const contracts = this.stateManager.getContracts();
    const notes = this.stateManager.getNotes();

    const summary = this.getSummaryData(contracts, notes);

    const container = document.createElement('div');
    container.className = 'space-y-6';

    container.innerHTML = `
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Relatórios</h1>
        <button id="exportBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          Exportar Relatório
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="mb-6">
          <h2 class="text-lg font-bold text-gray-800">Relatórios e Estatísticas</h2>
          <p class="text-sm text-gray-500">Visualize dados e métricas do sistema</p>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Total de Contratos -->
          <div class="p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
            <p class="text-sm text-gray-500 mb-1">Total de Contratos</p>
            <p class="text-2xl font-bold text-gray-800">${summary.totalContracts}</p>
            <p class="text-xs text-gray-400 mt-1">${summary.activeContracts} ativos, ${summary.expiredContracts} vencidos</p>
          </div>

          <!-- Alertas de Vencimento -->
          <div class="p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
            <p class="text-sm text-gray-500 mb-1">Alertas de Vencimento</p>
            <p class="text-2xl font-bold text-gray-800">${summary.expiringContracts}</p>
            <p class="text-xs text-gray-400 mt-1">Contratos vencem em até 30 dias</p>
          </div>

          <!-- Total de Notas -->
          <div class="p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
            <p class="text-sm text-gray-500 mb-1">Total de Notas</p>
            <p class="text-2xl font-bold text-gray-800">${summary.totalNotes}</p>
            <p class="text-xs text-gray-400 mt-1">${summary.notesWithExit} com saída, ${summary.pendingNotes} pendentes</p>
          </div>

          <!-- Valor Total -->
          <div class="p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
            <p class="text-sm text-gray-500 mb-1">Valor Total</p>
            <p class="text-2xl font-bold text-gray-800">R$ ${summary.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p class="text-xs text-gray-400 mt-1">Soma de todas as notas fiscais</p>
          </div>
        </div>

        <!-- Charts Row 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="border border-gray-100 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">Contratos por Status</h3>
            <div class="h-64">
              <canvas id="contractsStatusChart"></canvas>
            </div>
          </div>
          <div class="border border-gray-100 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">Notas por Mês</h3>
            <div class="h-64">
              <canvas id="notesPerMonthChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Charts Row 2 -->
        <div class="border border-gray-100 rounded-lg p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Top 10 Empresas por Valor</h3>
          <div class="h-80">
            <canvas id="topCompaniesChart"></canvas>
          </div>
        </div>
      </div>
    `;

    return container;
  }

  getSummaryData(contracts, notes) {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const activeContracts = contracts.filter(c => c.status === 'Ativo').length;
    const expiredContracts = contracts.filter(c => c.status === 'Vencido').length;

    const expiringContracts = contracts.filter(c => {
      const expiryDate = new Date(c.dataVencimento);
      return c.status === 'Ativo' && expiryDate >= today && expiryDate <= thirtyDaysFromNow;
    }).length;

    const notesWithExit = notes.filter(n => n.dataSaida).length;
    const pendingNotes = notes.length - notesWithExit;
    const totalValue = notes.reduce((sum, n) => sum + parseFloat(n.valor || 0), 0);

    return {
      totalContracts: contracts.length,
      activeContracts,
      expiredContracts,
      expiringContracts,
      totalNotes: notes.length,
      notesWithExit,
      pendingNotes,
      totalValue
    };
  }

  renderCharts() {
    this.destroyCharts();

    const contracts = this.stateManager.getContracts();
    const notes = this.stateManager.getNotes();

    // 1. Contratos por Status
    const statusData = {
      'Ativo': 0,
      'Pendente': 0,
      'Cancelado': 0,
      'Vencido': 0, // Added Vencido as it's a common status
      'Suspenso': 0
    };
    contracts.forEach(c => {
      if (statusData[c.status] !== undefined) {
        statusData[c.status]++;
      } else {
        // Handle unexpected statuses if necessary
        statusData[c.status] = (statusData[c.status] || 0) + 1;
      }
    });

    // Filter to only show relevant ones or all
    const statusLabels = Object.keys(statusData);
    const statusValues = Object.values(statusData);

    const ctxStatus = document.getElementById('contractsStatusChart');
    if (ctxStatus) {
      this.charts.status = new Chart(ctxStatus, {
        type: 'bar',
        data: {
          labels: statusLabels,
          datasets: [{
            label: 'Quantidade',
            data: statusValues,
            backgroundColor: '#3B82F6',
            borderRadius: 4,
            barPercentage: 0.5,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'end',
              labels: { boxWidth: 10, usePointStyle: true, pointStyle: 'rect' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#f3f4f6' },
              ticks: { stepSize: 1 }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    }

    // 2. Notas por Mês
    const notesByMonth = {};
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    // Initialize last 6 months or current year? Let's do all available or last 6 months.
    // Based on image "set. de 2025", "out. de 2025", "nov. de 2025".
    // Let's dynamically generate keys "mmm. de yyyy"

    notes.forEach(n => {
      if (!n.dataNota) return;
      const date = new Date(n.dataNota);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const key = `${months[monthIndex]}. de ${year}`;
      notesByMonth[key] = (notesByMonth[key] || 0) + 1;
    });

    // Sort keys chronologically?
    // Simple sort might not work for "jan. de 2025" vs "dez. de 2024".
    // Let's sort by date object.
    const sortedMonthKeys = Object.keys(notesByMonth).sort((a, b) => {
      const [ma, ya] = a.split('. de ');
      const [mb, yb] = b.split('. de ');
      const ia = months.indexOf(ma);
      const ib = months.indexOf(mb);
      return parseInt(ya) - parseInt(yb) || ia - ib;
    });

    const ctxNotes = document.getElementById('notesPerMonthChart');
    if (ctxNotes) {
      this.charts.notes = new Chart(ctxNotes, {
        type: 'bar',
        data: {
          labels: sortedMonthKeys,
          datasets: [{
            label: 'Quantidade',
            data: sortedMonthKeys.map(k => notesByMonth[k]),
            backgroundColor: '#3B82F6',
            borderRadius: 4,
            barPercentage: 0.5,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'end',
              labels: { boxWidth: 10, usePointStyle: true, pointStyle: 'rect' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#f3f4f6' },
              ticks: { stepSize: 1 }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    }

    // 3. Top 10 Empresas por Valor
    const companies = {};
    notes.forEach(n => {
      const company = n.empresa || 'Desconhecida';
      companies[company] = (companies[company] || 0) + parseFloat(n.valor || 0);
    });

    const sortedCompanies = Object.entries(companies)
      .sort(([, valA], [, valB]) => valB - valA)
      .slice(0, 10);

    const ctxCompanies = document.getElementById('topCompaniesChart');
    if (ctxCompanies) {
      this.charts.companies = new Chart(ctxCompanies, {
        type: 'bar',
        indexAxis: 'y',
        data: {
          labels: sortedCompanies.map(([name]) => name),
          datasets: [{
            label: 'Valor Total',
            data: sortedCompanies.map(([, val]) => val),
            backgroundColor: '#10B981', // Green
            borderRadius: 4,
            barPercentage: 0.6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'center',
              labels: { boxWidth: 10, usePointStyle: true, pointStyle: 'rect' }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.x !== null) {
                    label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.x);
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: '#f3f4f6' }
            },
            y: {
              grid: { display: false }
            }
          }
        }
      });
    }
  }

  destroyCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    this.charts = {};
  }

  attachEventListeners(container) {
    const exportBtn = container.querySelector('#exportBtn');
    exportBtn?.addEventListener('click', () => this.exportToCSV());
  }

  exportToCSV() {
    const notes = this.stateManager.getNotes();
    if (notes.length === 0) {
      alert('Não há dados para exportar');
      return;
    }

    let csv = 'Data de Entrada,Empenho,Empresa,Setor,Número da Nota,Data da Nota,Valor,Data de Saída,Observações\n';
    notes.forEach(note => {
      csv += `${note.dataEntrada},${note.empenho},${note.empresa},${note.setor},${note.numeroNota},${note.dataNota},${note.valor},${note.dataSaida || ''},${note.observacao || ''}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_notas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  destroy() {
    this.destroyCharts();
  }
}
