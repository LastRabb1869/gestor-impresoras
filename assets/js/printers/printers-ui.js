// assets/js/printers/printers-ui.js

import { fetchImpresoras } from './printers-api.js';
import { initModalImpresora } from './modal-impresora.js';
import { fetchUbicaciones } from './printers-api.js';

let selectedLocations = [];   // IDs de ubicaciones marcadas
let currentEstadoFilter = 'todas';

function updateLocationHighlight(filterAll) {
  filterAll.classList.toggle('location-active', selectedLocations.length > 0);
}

export function initPrintersUI() {
  const impresorasSection = document.getElementById('impresoras-section');
  const navBtn            = document.querySelector('.nav-item[data-section="impresoras-section"]');
  const filterBtns        = impresorasSection.querySelectorAll('.filter-button:not(.filter-all)');
  const filterAll         = impresorasSection.querySelector('.filter-all');
  const dropdown          = filterAll.querySelector('.filter-all__dropdown');
  const textPart          = filterAll.querySelector('.filter-all__text');
  const iconPart          = filterAll.querySelector('.filter-all__icon');

  // 1) Al cargar pestaña: reset de estado y ubicación
  navBtn.addEventListener('click', () => {
    currentEstadoFilter = 'todas';
    selectedLocations = [];
    filterAll.classList.remove('open', 'location-active');
    cargarImpresoras().then(() => {
      applyCombinedFilter();
      filterBtns.forEach(b => b.classList.remove('active'));
      filterAll.classList.add('active'); // resalta el texto “Todas”
      dropdown.classList.add('hidden');
    });
  });

  // 2) Click en texto “Todas” => solo filtro estado
  textPart.addEventListener('click', () => {
    currentEstadoFilter = 'todas';
    applyCombinedFilter();
    filterBtns.forEach(b => b.classList.remove('active'));
    filterAll.classList.add('active');
  });

  // 3) Click en icono => abre/cierra dropdown de ubicaciones
  iconPart.addEventListener('click', async (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.toggle('hidden');
    filterAll.classList.toggle('open', isOpen);
    if (!dropdown.dataset.loaded) {
      const ubicaciones = await fetchUbicaciones();
      dropdown.innerHTML = ubicaciones.map(u => `
        <label>
          <input type="checkbox" value="${u.id}">
          ${u.nombre}
        </label>
      `).join('');
      dropdown.dataset.loaded = 'true';
      // listener para cada checkbox
      dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
          selectedLocations = Array.from(dropdown.querySelectorAll('input:checked'))
                                   .map(i => i.value);
          applyCombinedFilter();
          updateLocationHighlight(filterAll);
        });
      });
    }
  });

  // 4) Click fuera cierra dropdown
  document.addEventListener('click', e => {
    if (!e.target.closest('.filter-all')) {
      dropdown.classList.add('hidden');
      filterAll.classList.remove('open');
    }
  });

  // 5) Delegación de filtros por estado
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      filterAll.classList.remove('active');
      btn.classList.add('active');
      currentEstadoFilter = btn.dataset.filter;
      applyCombinedFilter();
    });
  });

  // 6) Inicializa modal + primeras tarjetas
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
    card.dataset.ubicacionId = c.ubicacion_id; 
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

// Filtrado combinado: estado + ubicaciones
export function applyCombinedFilter() {
  document.querySelectorAll('#impresoras-section .impresora-card')
    .forEach(card => {
      const est = card.dataset.estado;
      const ubi = card.dataset.ubicacionId;
      const okEstado = (currentEstadoFilter === 'todas')
        || (currentEstadoFilter === 'operativas'    && est === 'FUNCIONANDO')
        || (currentEstadoFilter === 'con-problemas' && est === 'CON PROBLEMAS')
        || (currentEstadoFilter === 'reparando'     && est === 'REPARANDO')
        || (currentEstadoFilter === 'no-operativas' && est === 'BAJA');
      const okUbi = selectedLocations.length === 0 
        || selectedLocations.includes(ubi);
      card.style.display = (okEstado && okUbi) ? 'flex' : 'none';
    });
}

// Para recargas externas
window.addEventListener('recargar-impresoras', cargarImpresoras);