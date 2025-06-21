// assets/js/changes/changes-ui.js

import { fetchCambios } from './changes-api.js';

export function initChangesUI() {
  const navBtn = document.querySelector('.nav-item[data-section="cambios-section"]');
  navBtn.addEventListener('click', cargarCambios);
  // Permite recargar desde otros módulos
  window.addEventListener('recargar-cambios', cargarCambios);
}

export async function cargarCambios() {
  const data = await fetchCambios();
  const cont = document.querySelector('#cambios-section .cards-container');
  cont.innerHTML = '';
  if (!data.length) {
    cont.innerHTML = '<p>No hay cambios realizados.</p>';
    return;
  }
  data.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card cambio-card';
    card.innerHTML = `
      <div class="card-info">
        <h3>Cambio en impresora: ${c.impresora}</h3>
        <p><strong>Con S/N:</strong> ${c.num_serie}</p>
        <p><strong>Componente:</strong> ${c.componente}</p>
        <p><strong>Cambiado:</strong><small> ${c.fecha_hora}</small></p>
        <button class="expand-button" data-id="${c.id}">Ver</button>
      </div>
    `;
    cont.appendChild(card);
  });
}

export function bindChangesDelegation() {
  const section = document.getElementById('cambios-section');
  section.addEventListener('click', e => {
    const btn = e.target.closest('.expand-button');
    if (!btn) return;
    const id = btn.dataset.id;
    console.log('Ver cambio', id);
    // Aquí podrías abrir modal o página de detalle
  });
}