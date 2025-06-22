// assets/js/departaments/departaments-ui.js

import { fetchDepartamentos } from './departaments-api.js';

export function initDepartamentsUI() {
  const departamentosSection = document.getElementById('departamentos-section');
  const navBtn = document.querySelector('.nav-item[data-section="departamentos-section"]');
  const filterBtns = departamentosSection.querySelectorAll('.filter-button-dep');

    // Al hacer click en la pestaña, cargamos departamentos y activamos "Todos"
    navBtn.addEventListener('click', () => {
      cargarDepartamentos().then(() => {
        // al cargar, ponemos activo el filtro "todos"
        filterBtns.forEach(b => b.classList.remove('active'));
        departamentosSection.querySelector('.filter-button-dep[data-filter="todos"]')
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
        applyDepartamentFilter(btn.dataset.filter);
      });
    });

    // Arrancamos el modal
  
}

export async function cargarDepartamentos() {
  const data = await fetchDepartamentos();
  const cont = document.querySelector('#departamentos-section .cards-container');
  cont.innerHTML = '';
  if (!data.length) {
    cont.innerHTML = '<p>No hay departamentos.</p>';
    return;
  }
  data.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card departamento-card';
    card.dataset.tipo = c.tipo;
    card.innerHTML = `
      <div class="card-info">
        <h3>${c.nombre}</h3>
        <p><strong>Tipo:</strong> ${c.tipo}</p>
        <button class="expand-button" data-id="${c.id}">Ver</button>
      </div>`;
    cont.appendChild(card);
  });
}

export function applyDepartamentFilter(filter) {
  document.querySelectorAll('#departamentos-section .departamento-card')
    .forEach(card => {
      const tipo = card.dataset.tipo;
      const ok = filter === 'todos'
        || (filter === 'site'  && tipo === 'SITE')
        || (filter === 'bar'   && tipo === 'BAR')
        || (filter === 'heladeria' && tipo === 'HELADERIA')
        || (filter === 'lobby'     && tipo === 'LOBBY')
        || (filter === 'oficina'       && tipo === 'OFICINA');
      card.style.display = ok ? 'flex' : 'none';
    });
}
