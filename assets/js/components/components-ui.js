// assets/js/components/components-ui.js
import { fetchComponentes } from './components-api.js';

export function initComponentsUI() {
  const componentesSection = document.getElementById('componentes-section');
  const navBtn = document.querySelector('.nav-item[data-section="componentes-section"]');
  // When section is activated, load componentes and init filters
  navBtn.addEventListener('click', () => cargarComponentes());

  // Delegate filter button clicks
  componentesSection.addEventListener('click', e => {
    if (e.target.closest('.filter-button-comp')) {
      const btn = e.target.closest('.filter-button-comp');
      componentesSection.querySelectorAll('.filter-button-comp').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyComponentFilter(btn.dataset.filter);
    }
    if (e.target.closest('.expand-button')) {
      console.log('Ver componente', e.target.closest('.expand-button').dataset.id);
    }
  });
}

export async function cargarComponentes() {
  const data = await fetchComponentes();
  const cont = document.querySelector('#componentes-section .cards-container');
  cont.innerHTML = '';
  if (!data.length) {
    cont.innerHTML = '<p>No hay componentes.</p>';
    return;
  }
  data.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card componente-card';
    card.dataset.estado = c.estado;
    card.innerHTML = `
      <div class="card-img">
        <img src="../assets/sources/components/${c.num_serie}/img/${c.imagen || 'default-componente.jpg'}" alt="${c.nombre}">
      </div>
      <div class="card-info">
        <h3>${c.nombre}</h3>
        <p><strong>Serie:</strong> ${c.num_serie}</p>
        <p><strong>Marca:</strong> ${c.marca}</p>
        <p><strong>Ubicación:</strong> ${c.ubicacion}</p>
        <p><strong>Estado:</strong> ${c.estado}</p>
        <p><strong>Stock:</strong> ${c.cantidad_stock}</p>
        <button class="expand-button" data-id="${c.id}">Ver</button>
      </div>`;
    cont.appendChild(card);
  });
}

export function applyComponentFilter(filter) {
  document.querySelectorAll('#componentes-section .componente-card')
    .forEach(card => {
      const estado = card.dataset.estado;
      const ok = filter === 'todos'
        || (filter === 'en-condiciones'  && estado === 'EXCELENTES CONDICIONES')
        || (filter === 'posible-fallo'   && estado === 'POSIBLE FALLO')
        || (filter === 'baja-definitiva' && estado === 'BAJA DEFINITIVA')
        || (filter === 'desconocido'     && estado === 'DESCONOCIDO')
        || (filter === 'sin-stock'       && estado === 'SIN STOCK');
      card.style.display = ok ? 'flex' : 'none';
    });
}
