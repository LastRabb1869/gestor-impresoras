// assets/js/dashboard.js
import { notificationManager } from './alerts/notification-manager.js';
import { initNav } from './nav.js';
import { initSidebar } from './ui/sidebar.js';
import { initMobileNav } from './ui/movile-nav.js';
import { initFab } from './ui/fab.js';
import { initPrintersUI } from './printers/printers-ui.js';
import { initComponentsUI } from './components/components-ui.js';
import { initDepartamentsUI } from './departaments/departaments-ui.js';
import { cargarAlertas, initAlertsUI } from './alerts/alerts-ui.js';
import { initChangesUI, bindChangesDelegation } from './changes/changes-ui.js';
//import { changeDataProfile } from './profile.js';

document.addEventListener('DOMContentLoaded', async () => {
  // — Elementos principales —
  await notificationManager.init();
  
  initSidebar();
  initMobileNav();
  initFab();
  initPrintersUI();
  initComponentsUI();
  initDepartamentsUI();
  initAlertsUI();
  initChangesUI();
//  changeDataProfile();
  bindChangesDelegation();  
  await initNav();

  await cargarAlertas();

  // — Se fuerza el inicializar en impresoras —
  document.querySelector('.nav-item[data-section="impresoras-section"]').click();
});