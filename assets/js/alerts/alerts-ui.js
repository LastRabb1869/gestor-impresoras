// assets/js/alerts/alerts-ui.js
import { fetchAlertas } from './alerts-api.js';

/**
 * Inicializa la UI de Alertas: carga y filtros.
 */
export function initAlertsUI() {
  const alertasSection = document.getElementById('alertas-section');
  const navBtn = document.querySelector('.nav-item[data-section="alertas-section"]');
  const filterButtons = alertasSection.querySelectorAll('.filter-button-alt');

  // Cuando se abre la pestaña de Alertas
  navBtn.addEventListener('click', () => cargarAlertas());

  // Delegación para filtros y botones Ver
  alertasSection.addEventListener('click', e => {
    const btn = e.target.closest('.filter-button-alt');
    if (btn) {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyWarningFilter(btn.dataset.filter);
      return;
    }
    const expand = e.target.closest('.expand-button');
    if (expand) {
      console.log('Ver alerta', expand.dataset.id);
    }
  });

  // Disparamos una recarga inicial
  window.addEventListener('recargar-alertas', cargarAlertas);
}

/**
 * Carga y renderiza las tarjetas de alertas.
 */
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
    card.innerHTML = `
      <div class="card-info">
        <h3>Alerta #${a.id} – Prioridad: ${a.prioridad}</h3>
        <p><strong>Impresora:</strong> ${a.impresora}</p>
        <p><strong>IP:</strong> ${a.direccion_ip}</p>
        <p><strong>Estado:</strong> ${a.estado_actual}</p>
        <p><strong>Reportado:</strong> <small>${a.fecha_hora}</small></p>
        <button class="expand-button" data-id="${a.id}">Ver</button>
      </div>`;
    cont.appendChild(card);
  });
}

/**
 * Filtra las alertas según estado.
 */
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
