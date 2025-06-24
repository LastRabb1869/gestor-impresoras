// assets/js/printers/modal-impresora.js

import { cargarUbicaciones } from '../departaments/departaments-api.js';
import { setImpresora } from './printers-api.js';
import { initFieldValidation, initImageValidation, resetFieldValidation } from '../ui/validation.js';

export function initModalImpresora() {
  const modal = document.getElementById('modal-impresora');
  const form = modal.querySelector('#form-impresora');
  const imgInput = modal.querySelector('#imagen_impresora');
  const previewImg = modal.querySelector('#preview-img_impresora');
  const placeholder = modal.querySelector('.placeholder-text');

  // 1) Enganchar validación genérica:
  window.addEventListener('abrir-modal-impresora', () => {
    modal.classList.remove('hidden');
    cargarUbicaciones('select-ubicacion-impresora');
    form.reset();

    // estado limpio
    previewImg.style.display  = 'none';
    placeholder.style.display = 'block';

    resetFieldValidation(modal);
    initFieldValidation(modal);
    initImageValidation(
      modal,
      '#imagen_impresora',
      '#preview-img_impresora',
      '.placeholder-text'
    );
  });

  // 2) Cerrar…
  function cerrar() {
    if (confirm('¿Deseas cancelar el registro de la impresora?')) {
      modal.classList.add('hidden');
    }
  }
  modal.querySelector('.modal-close').addEventListener('click', cerrar);
  modal.querySelector('.btn-cancel').addEventListener('click', cerrar);

  // 3) Submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!confirm('¿Confirmas que deseas añadir esta impresora?')) return;
    const resp = await setImpresora(new FormData(form));
    if (resp.trim() === 'OK') {
      alert('¡Impresora registrada!');
      modal.classList.add('hidden');
      window.dispatchEvent(new Event('recargar-impresoras'));
    } else {
      alert('Error: ' + resp);
    }
  });
}