// assets/js/users/profile.js

import { initModalConfirm, initModalError } from '../ui/modal-mensaje.js';
import { setProfile } from './profile-api.js';

export function initProfileSection() {
  const form = document.getElementById('form-profile');
  if (!form) return;

  const fileInput = form.querySelector('#imagen');
  const imgPrev   = form.querySelector('#preview-photo');
  let dirty = false;

  // Preview de la nueva foto y dirty flag
  fileInput.addEventListener('change', e => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = ev => imgPrev.src = ev.target.result;
      reader.readAsDataURL(f);
      dirty = true;
    }
  });

  // Cualquier otro input marca dirty
  form.querySelectorAll('input[type=text],input[type=password]').forEach(i =>
    i.addEventListener('input', ()=> dirty = true)
  );

  // Antes de salir de la página
  window.addEventListener('beforeunload', e => {
    if (dirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const ok = await initModalConfirm('Confirmar cambios',
      '¿Deseas guardar los cambios en tu perfil?');
    if (!ok) return;

    const fd = new FormData(form);
    try {
      const { success, message } = await setProfile(fd);
      if (success) {
        initModalError('¡Éxito!', message, 'success');
        dirty = false;
        // recarga para refrescar sidebar y ruta de imagen
        setTimeout(()=> location.reload(), 800);
      } else {
        throw new Error(message);
      }
    } catch (err) {
      initModalError('ERROR', err.message || 'Falla de red', 'error');
    }
  });
}