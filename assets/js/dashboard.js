// assets/js/dashboard.js
import { initNav } from './nav.js';
import {  initSidebar } from './ui/sidebar.js';
import { initMobileNav } from './ui/movile-nav.js';
import { initFab } from './ui/fab.js';
import { initPrintersUI } from './printers/printers-ui.js';
import { initComponentsUI } from './components/components-ui.js';
import { initDepartamentsUI } from './departaments/departaments-ui.js';
import { initAlertsUI } from './alerts/alerts-ui.js';
import { initChangesUI, bindChangesDelegation } from './changes/changes-ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // — Elementos principales —
  initSidebar();
  initMobileNav();
  initFab();
  initPrintersUI();
  initComponentsUI();
  initDepartamentsUI();
  initAlertsUI();
  initChangesUI();
  bindChangesDelegation();
  initNav();

  // — Se fuerza el inicializar en impresoras —
  document.querySelector('.nav-item[data-section="impresoras-section"]').click();
});