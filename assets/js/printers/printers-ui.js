// assets/js/printers/printers-ui.js

import { fetchImpresoras } from './printers-api.js';
import { initModalImpresora } from './modal-impresora.js';

// exportas la inicialización principal
export function initPrintersUI() {
  const impresorasSection = document.getElementById('impresoras-section');
  const navBtn            = document.querySelector('.nav-item[data-section="impresoras-section"]');
  const filterBtns        = impresorasSection.querySelectorAll('.filter-button');

  // Al hacer click en la pestaña, cargamos impresoras y activamos "Todas"
  navBtn.addEventListener('click', () => {
    cargarImpresoras().then(() => {
      // al cargar, ponemos activo el filtro "todas"
      filterBtns.forEach(b => b.classList.remove('active'));
      impresorasSection.querySelector('.filter-button[data-filter="todas"]')
        .classList.add('active');
    });
  });

  // Delegación de clicks para los filtros
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // marcador visual
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // aplicar filtro
      applyPrinterFilter(btn.dataset.filter);
    });
  });

  // arrancamos el modal
  initModalImpresora();
}

// fetch + render de tarjetas
export async function cargarImpresoras() {
  const data = await fetchImpresoras();
  const cont = document.querySelector('#impresoras-section .cards-container');
  cont.innerHTML = '';
  if (!data.length) {
    cont.innerHTML = '<p>No hay impresoras.</p>';
    return;
  }
  data.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card impresora-card';
    card.dataset.estado = c.estado;
    card.innerHTML = `
      <div class="card-img">
        <img src="../assets/sources/printers/${c.num_serie}/img/${c.imagen || 'default-impresora.jpg'}" alt="${c.nombre}">
      </div>
      <div class="card-info">
        <h3>${c.nombre}</h3>
        <p><strong>Serie:</strong> ${c.num_serie}</p>
        <p><strong>Marca:</strong> ${c.marca}</p>
        <p><strong>Ubicación:</strong> ${c.ubicacion}</p>
        <p><strong>Estado:</strong> ${c.estado}</p>
        <button class="expand-button" data-id="${c.id}">Ver</button>
      </div>`;
    cont.appendChild(card);
  });
}

// Lógica de filtro
export function applyPrinterFilter(filter) {
  document.querySelectorAll('#impresoras-section .impresora-card')
    .forEach(card => {
      const estado = card.dataset.estado;
      const ok = filter === 'todas'
              || (filter === 'operativas'    && estado === 'FUNCIONANDO')
              || (filter === 'con-problemas' && estado === 'CON PROBLEMAS')
              || (filter === 'reparando'     && estado === 'REPARANDO')
              || (filter === 'no-operativas' && estado === 'BAJA');
      card.style.display = ok ? 'flex' : 'none';
    });
}

// Opcional: si quieres disparar recarga desde otro módulo
window.addEventListener('recargar-impresoras', cargarImpresoras);
