// assets/js/ui/fab.js

export function initFab() {
  const fabToggle  = document.getElementById('fab-toggle');
  const fabOptions = document.querySelector('.fab-options');

  fabToggle.addEventListener('click', e => {
    e.stopPropagation();
    fabOptions.classList.toggle('hidden');
  });

  document.addEventListener('click', () => fabOptions.classList.add('hidden'));

  fabOptions.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const action = btn.dataset.action;
      let navButton;
      switch(action) {
        case 'impresora':
          navButton = document.querySelector('.nav-item[data-section="impresoras-section"]');
          break;
        case 'componente':
          navButton = document.querySelector('.nav-item[data-section="componentes-section"]');
          break;
        case 'departamento':
          navButton = document.querySelector('.nav-item[data-section="departamentos-section"]');
          break;
        case 'alerta':
          navButton = document.querySelector('.nav-item[data-section="alertas-section"]');
          break;
        case 'cambio':
          navButton = document.querySelector('.nav-item[data-section="cambios-section"]');
          break;
      }
      if (navButton) navButton.click();
      
      // Disparamos el evento para abrir el modal correspondiente
      switch(action) {
        case 'impresora':
          window.dispatchEvent(new Event('abrir-modal-impresora'));
          break;
        case 'componente':
          window.dispatchEvent(new Event('abrir-modal-componente'));
          break;
        case 'departamento':
          window.dispatchEvent(new Event('abrir-modal-departamento'));
          break;
        case 'alerta':
          window.dispatchEvent(new Event('abrir-modal-alerta'));
          break;
        case 'cambio':
          window.dispatchEvent(new Event('abrir-modal-cambio'));
          break;
      }
      fabOptions.classList.add('hidden');
    });
  });
}
