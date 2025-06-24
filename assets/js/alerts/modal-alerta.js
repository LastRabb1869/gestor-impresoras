// assets/js/alerts/modal-alerta.js

import { cargarUbicaciones } from '../departaments/departaments-api.js';
import { setAlerta } from './components-api.js';
import { initFieldValidation, initImageValidation } from '../ui/validation.js';

export function initModalAlerta() {
  const modal = document.getElementById('modal-alerta');
  const form = modal.querySelector('#form-alerta');
  const imgInput = modal.querySelector('#imagen_alerta');
  const previewImg = modal.querySelector('#preview-img_alerta');
  const placeholder = modal.querySelector('.placeholder-text');

  // 1) Enganchar validación genérica:
  window.addEventListener('abrir-modal-alerta', () => {
    modal.classList.remove('hidden');
    cargarUbicaciones('select-ubicacion-alerta');
    form.reset();

    // estado limpio
    previewImg.style.display  = 'none';
    placeholder.style.display = 'block';
    initFieldValidation(modal);
    initImageValidation(
      modal,
      '#imagen_alerta',
      '#preview-img_alerta',
      '.placeholder-text'
    );
  });

  // 2) Cerrar…
  function cerrar() {
    if (confirm('¿Deseas cancelar el registro del alerta?')) {
      modal.classList.add('hidden');
    }
  }
  modal.querySelector('.modal-close').addEventListener('click', cerrar);
  modal.querySelector('.btn-cancel').addEventListener('click', cerrar);

  // 3) Submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!confirm('¿Confirmas que deseas añadir esta alerta?')) return;
    const resp = await setAlerta(new FormData(form));
    if (resp.trim() === 'OK') {
      alert('¡alerta registrado!');
      cerrar();
      window.dispatchEvent(new Event('recargar-alertas'));
    } else {
      alert('Error: ' + resp);
    }
  });
}