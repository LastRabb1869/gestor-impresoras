// assets/js/alerts/alerts-ui.js

import { fetchAlertasDelta} from './alerts-api.js';
import { notificationManager } from './notification-manager.js';
import { initModalAlerta } from './modal-alerta.js';

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
        applyWarningFilter(activeBtn.dataset.filter);
      }
    });  

  // Arrancamos el modal
  initModalAlerta();
}

let ultimaFecha = null;     // ISO string de la alerta más reciente
let pollingActivo = false;

export async function cargarAlertas() {

  // ① Traer solo lo nuevo
  const nuevas = await fetchAlertasDelta(ultimaFecha);

  // ② Actualizar timestamp más reciente
  if (nuevas.length) {
    ultimaFecha = nuevas[0].fecha_reportado;
    nuevas.forEach(a => {
      renderAlerta(a);                     // ⬅️ crea card si no existe
      if (a.estado_actual === 'EN PROCESO') {
        notificationManager.schedule(a);   // ⬅️ programa si no estaba
      }
    });
  }

  // ③ Mensaje si contenedor quedó vacío
  const cont = document.querySelector('#alertas-section .cards-container');
  if (!cont.children.length) {
    cont.innerHTML = '<p>No hay alertas pendientes.</p>';
  }

  // ④ Polling único
  if (!pollingActivo) {
    pollingActivo = true;
    setInterval(cargarAlertas, 60_000);
  } 
}

function formatFechaHora(dt) {
  if (!dt) return 'Sin concluir';
  const d = new Date(dt.replace(' ', 'T'));        // ‘2025-06-27 14:05:12’
  const fecha = d.toLocaleDateString('es-MX');     // 27/06/25
  const hora  = d.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' }); // 14:05
  return `${fecha} a las ${hora}`;
}


// ——— crea la tarjeta solo si no existe ya ———
function renderAlerta(a) {
  const cont = document.querySelector('#alertas-section .cards-container');
  if (document.getElementById('alerta-'+a.id)) return;   // ya existe

  const card = document.createElement('div');
  card.className = 'card alerta-card';
  card.id        = 'alerta-'+a.id;
  card.dataset.estado = a.estado_actual;
  card.innerHTML = `
    <div class="card-info">
      <h3>Alerta #${a.id} – Prioridad: ${a.prioridad}</h3>
      <p><strong>Impresora:</strong> ${a.impresora}</p>
      <p><strong>IP:</strong> ${a.direccion_ip}</p>
      <p><strong>Estado:</strong> ${a.estado_actual}</p>
      <p><strong>Reportado:</strong> <small>${formatFechaHora(a.fecha_reportado)}</small></p>
      <p><strong>Concluido:</strong> <small>${formatFechaHora(a.fecha_concluido)}</small></p>
      <button class="expand-button" data-id="${a.id}">Ver</button>
    </div>`;
  cont.appendChild(card);
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