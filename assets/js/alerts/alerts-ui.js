// assets/js/alerts/alerts-ui.js

import { fetchAlertas } from './alerts-api.js';

export function initAlertsUI() {
  const alertasSection = document.getElementById('alertas-section');
  const navBtn = document.querySelector('.nav-item[data-section="alertas-section"]');
  const filterBtns = alertasSection.querySelectorAll('.filter-button-alt');

  // Al hacer click en la pestaña, cargamos alertas y activamos "Todas"
  navBtn.addEventListener('click', () => {
    cargarAlertas().then(() => {
      // al cargar, ponemos activo el filtro "todas"
      filterBtns.forEach(b => b.classList.remove('active'));
      alertasSection.querySelector('.filter-button-alt[data-filter="todas"]')
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
      applyWarningFilter(btn.dataset.filter);
    });
  });

    // Escuchar recarga de alertas después de registrar
    window.addEventListener('recargar-alertas', async () => {
      await cargarAlertas();

      // reaplicar filtro activo
      const activeBtn = document.querySelector('.filter-button-alt.active');
      if (activeBtn) {
        applyComponentFilter(activeBtn.dataset.filter);
      }
    });  

  // Arrancamos el modal
}

export async function cargarAlertas() {
  const data = await fetchAlertas();
  const cont = document.querySelector('#alertas-section .cards-container');
  cont.innerHTML = '';
  if (!data.length) {
    cont.innerHTML = '<p>No hay alertas pendientes.</p>';
    return;
  }
  data.forEach(a => {
    const card = document.createElement('div');
    card.className = 'card alerta-card';
    card.dataset.estado = a.estado_actual;
    if (a.fecha_concluido == null) {
      a.fecha_concluido = 'Sin concluir';
    }
    card.innerHTML = `
      <div class="card-info">
        <h3>Alerta #${a.id} – Prioridad: ${a.prioridad}</h3>
        <p><strong>Impresora:</strong> ${a.impresora}</p>
        <p><strong>IP:</strong> ${a.direccion_ip}</p>
        <p><strong>Estado:</strong> ${a.estado_actual}</p>
        <p><strong>Reportado:</strong> <small>${a.fecha_reportado}</small></p>
        <p><strong>Concluido:</strong> <small>${a.fecha_concluido}</small></p>
        <button class="expand-button" data-id="${a.id}">Ver</button>
      </div>`;
    cont.appendChild(card);
  });
}

export function applyWarningFilter(filter) {
  document.querySelectorAll('#alertas-section .alerta-card').forEach(card => {
    const es = card.dataset.estado;
    const ok = filter === 'todas'
            || (filter === 'completado' && es === 'COMPLETADO')
            || (filter === 'en-proceso' && es === 'EN PROCESO')
            || (filter === 'sin-arreglo' && es === 'SIN ARREGLO');
    card.style.display = ok ? 'flex' : 'none';
  });
}
