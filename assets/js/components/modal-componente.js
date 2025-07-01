// assets/js/printers/modal-componente.js

import { initModalConfirm, initModalError } from '../ui/modal-mensaje.js';
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
  async function cerrar() {
    const ok = await initModalConfirm(
      'Cancelar',
      '¿Deseas cancelar el registro del componente?'
    );
    if (ok) { // usuario aceptó cancelar
      modal.classList.add('hidden');
    }
  }
  modal.querySelector('.modal-close').addEventListener('click', cerrar);
  modal.querySelector('.btn-cancel').addEventListener('click', cerrar);

  // 3) Submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    // 1) Confirmar acción
    const ok = await initModalConfirm(
      'Confirmar',
      '¿Confirmas que deseas añadir este componente?'
    );
    if (!ok) return;

    // 2) Realizar petición
    try {
      const resp = await setComponente(new FormData(form));
      if (resp.trim() === 'OK') {
        initModalError('¡Éxito!', 'Componente registrado.', 'success');
        modal.classList.add('hidden');
        window.dispatchEvent(new Event('recargar-componentes'));
      } else {
        throw new Error(resp);
      }
    } catch (err) {
      initModalError('ERROR', err.message, 'error');
    }
  });
}