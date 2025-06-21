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
        case 'alerta':
        case 'cambio':
          navButton = document.querySelector('.nav-item[data-section="alertas-section"]');
          break;
      }
      if (navButton) navButton.click();
      // disparar modal solo para impresoras; los demás vendrán luego
      if (action === 'impresora') window.dispatchEvent(new Event('abrir-modal-impresora'));
      fabOptions.classList.add('hidden');
    });
  });
}
