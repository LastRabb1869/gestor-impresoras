// assets/js/nav.js
import { cargarImpresoras, applyPrinterFilter } from './printers/printers-ui.js';
import { cargarComponentes, applyComponentFilter } from './components/components-ui.js';
import { cargarAlertas, applyWarningFilter } from './alerts/alerts-ui.js';
import { cargarCambios } from './changes/changes-ui.js';

export function initNav() {
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const sections = document.querySelectorAll('.dashboard-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // 1) Alternar clase active
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      // 2) Mostrar u ocultar secciones
      const target = item.dataset.section;
      sections.forEach(s => {
        s.id === target ? s.classList.add('active') : s.classList.remove('active');
      });
      // 3) Inicializar según sección
      switch (target) {
        case 'impresoras-section':
          cargarImpresoras();
          // reset filtros
          document.querySelectorAll('#impresoras-section .filter-button').forEach(b => b.classList.remove('active'));
          document.querySelector('#impresoras-section .filter-button[data-filter="todas"]').classList.add('active');
          applyPrinterFilter('todas');
          break;
        case 'componentes-section':
          cargarComponentes();
          document.querySelectorAll('#componentes-section .filter-button-comp').forEach(b => b.classList.remove('active'));
          document.querySelector('#componentes-section .filter-button-comp[data-filter="todos"]').classList.add('active');
          applyComponentFilter('todos');
          break;
        case 'alertas-section':
          cargarAlertas();
          document.querySelectorAll('#alertas-section .filter-button-alt').forEach(b => b.classList.remove('active'));
          document.querySelector('#alertas-section .filter-button-alt[data-filter="todas"]').classList.add('active');
          applyWarningFilter('todas');
          break;
        case 'cambios-section':
          cargarCambios();
          break;
      }
    });
  });
}
