// assets/js/alerts/modal-alerta.js

import { setAlerta, fetchImpresorasDisponibles } from './alerts-api.js';
import { initModalError } from '../ui/modal-mensaje.js';
import { initFieldValidation, resetFieldValidation } from '../ui/validation.js';

export function initModalAlerta() {
  const modal = document.getElementById('modal-alerta');
  const form = modal.querySelector('#form-alerta');
  const buscador = modal.querySelector('#buscador-impresora');
  const lista = modal.querySelector('#lista-impresoras');
  const ipField = modal.querySelector('#ip-impresora');
  const prioridad = modal.querySelector('#prioridad-alerta');
  const reporte = modal.querySelector('#reporte-alerta');
  let impresoraId = null;

  // 1) Al evento abrir-modal-alerta, resetea todo y muestra modal
  window.addEventListener('abrir-modal-alerta', async () => {
    resetFieldValidation(modal);
    form.reset();
    lista.innerHTML = '';
    ipField.value   = '';
    impresoraId     = null;

    initFieldValidation(modal);
    modal.classList.remove('hidden');
  });

  // 2) Cerrar modal
  function cerrar() {
    if (confirm('¿Cancelar registro de incidencia?')) {
      modal.classList.add('hidden');
    }
  }
  modal.querySelector('.modal-close').addEventListener('click', cerrar);
  modal.querySelector('.btn-cancel').addEventListener('click', cerrar);

  // 3) Buscador en tiempo real
  buscador.addEventListener('input', async () => {
    const term = buscador.value.trim().toLowerCase();
    lista.innerHTML = '';
    if (term.length < 2) return;

    // Obtener todas las impresoras y filtrar localmente
    let data = await fetchImpresorasDisponibles();
    // filtrar por nombre o S/N, y estado sin alerta activa
    data = data.filter(i =>
      (i.impresora.toLowerCase().includes(term) ||
       i.num_serie.toLowerCase().includes(term))
      &&
      i.estado_actual !== 'EN PROCESO'
    );
    if (!data.length) {
      lista.innerHTML = '<li>No se encontraron impresoras con esos datos</li>';
      return;
    }
    data.forEach(i => {
      const li = document.createElement('li');
      li.textContent = `${i.impresora} (${i.num_serie})`;
      li.onclick = () => {
        impresoraId = i.id;
        buscador.value = i.impresora;
        ipField.value = i.direccion_ip;
        lista.innerHTML = '';
      };
      lista.appendChild(li);
    });
  });

  // 4) Enviar formulario
  form.addEventListener('submit', async e => {
    e.preventDefault();
    // validación extra antes de enviar
    if (!impresoraId) {
      initModalError('ERROR', 'Selecciona una impresora válida.', 'error');
      return;
    }
    const fd = new FormData();
    fd.append('impresora_id', impresoraId);
    fd.append('prioridad', prioridad.value);
    fd.append('reporte', reporte.value.trim());

    try {
      const { success, message } = await setAlerta(fd);
      if (!success) throw new Error(message);
      initModalError('¡Éxito!', 'Incidencia creada correctamente.', 'success');
      modal.classList.add('hidden');
      window.dispatchEvent(new Event('recargar-alertas'));
    } catch (err) {
      initModalError('ERROR', err.message, 'error');
    }
  });
}