// assets/js/profile.js
import { initModalConfirm, initModalError } from './ui/modal-mensaje.js';

export function changeDataProfile () {

  const form = document.getElementById('form-profile');
  if (!form) return;        // la sección aún no está creada

  // ---- preview / dirty flag ----
  const fileInput = document.getElementById('imagen');
  const imgPrev   = document.getElementById('preview-photo');

  let dirty = false;
  const originales = {
    nombre   : form.nombre.value,
    apellido : form.apellido.value,
    photoSrc : imgPrev.src
  };

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => { imgPrev.src = ev.target.result; };
      reader.readAsDataURL(file);
      dirty = true;
    }
  });

  form.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => dirty = true);
  });

  // ---- salir de la sección (handled a través de initNav) ----
  window.addEventListener('beforeunload', e => {
    if (dirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // ---- envío ----
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const ok = await initModalConfirm('Confirmar cambios',
      '¿Guardar los cambios en tu perfil?');
    if (!ok) return;

    const fd = new FormData(form);
    try {
      const res = await fetch('set_info/update_profile.php', { method:'POST', body: fd });
      const { success, message } = await res.json();
      if (success) {
        initModalError('¡Éxito!', message, 'success');
        dirty = false;
        // recarga ligera para refrescar sidebar
        setTimeout(() => location.reload(), 800);
      } else {
        throw new Error(message);
      }
    } catch (err) {
      initModalError('ERROR', err.message || 'Falla de red', 'error');
    }
  });

  // ---- helper para restaurar si usuario cancela salir ----
  window.restoreProfileForm = () => {
    form.nombre.value   = originales.nombre;
    form.apellido.value = originales.apellido;
    imgPrev.src         = originales.photoSrc;
    fileInput.value     = '';
    dirty = false;
  };
}