// assets/js/printers/modal-componente.js

import { cargarUbicaciones } from '../departaments/departaments-api.js';
import { setComponente } from './components-api.js';
import { initFieldValidation, initImageValidation, resetFieldValidation } from '../ui/validation.js';

export function initModalComponente() {
  const modal = document.getElementById('modal-componente');
  const form = modal.querySelector('#form-componente');
  const imgInput = modal.querySelector('#imagen_componente');
  const previewImg = modal.querySelector('#preview-img_componente');
  const placeholder = modal.querySelector('.placeholder-text');

  // 1) Enganchar validación genérica:
  window.addEventListener('abrir-modal-componente', () => {
    modal.classList.remove('hidden');
    cargarUbicaciones('select-ubicacion-componente');
    form.reset();

    // estado limpio
    previewImg.style.display  = 'none';
    placeholder.style.display = 'block';
    resetFieldValidation(modal);
    initFieldValidation(modal);
    initImageValidation(
      modal,
      '#imagen_componente',
      '#preview-img_componente',
      '.placeholder-text'
    );
  });

  // 2) Cerrar…
  function cerrar() {
    if (confirm('¿Deseas cancelar el registro del componente?')) {
      modal.classList.add('hidden');
    }
  }
  modal.querySelector('.modal-close').addEventListener('click', cerrar);
  modal.querySelector('.btn-cancel').addEventListener('click', cerrar);

  // 3) Submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!confirm('¿Confirmas que deseas añadir esta componente?')) return;
    const resp = await setComponente(new FormData(form));
    if (resp.trim() === 'OK') {
      alert('¡Componente registrado!');
      modal.classList.add('hidden');
      window.dispatchEvent(new Event('recargar-componentes'));
    } else {
      alert('Error: ' + resp);
    }
  });
}