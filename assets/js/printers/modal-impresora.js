// assets/js/printers/modal-impresora.js

import { fetchUbicaciones, setImpresora } from './printers-api.js';
import { validarCampo } from '../ui/validation.js';
import { validarImagen } from '../ui/image-validation.js';

export function initModalImpresora() {
  const modal = document.getElementById('modal-impresora');
  const form = document.getElementById('form-impresora');
  const selectUbicacion = document.getElementById('select-ubicacion');
  const inputImagen = document.getElementById('imagen');
  const nombreArchivo = document.getElementById('nombre-archivo');
  // ** seleciona el preview dentro del modal **
  const preview = modal.querySelector('#preview-img');

  // escuchador para mostrar el modal
  window.addEventListener('abrir-modal-impresora', () => {
    modal.classList.remove('hidden');
    cargarUbicaciones();
  });

  // validaciones a los campos “validable”
  document.querySelectorAll('.validable').forEach(input =>
    input.addEventListener('blur', () => validarCampo(input))
  );

  // cerrar
  function cerrarModal() {
    if (confirm('¿Deseas cancelar el registro de la impresora?')) {
      form.reset();
      // limpiar estado validación
      document.querySelectorAll('.status-icon').forEach(icon => {
        icon.classList.remove('error','ok');
        icon.innerHTML = '';
      });
      document.querySelectorAll('.tooltip').forEach(tip =>
        tip.style.display = 'none'
      );
      // limpiar preview
      preview.src = '';
      preview.style.display = 'none';
      nombreArchivo.textContent = '';

      modal.classList.add('hidden');
    }
  }
  modal.querySelector('.modal-close').addEventListener('click', cerrarModal);
  modal.querySelector('.btn-cancel').addEventListener('click', cerrarModal);

  // carga ubicaciones
  async function cargarUbicaciones() {
    const data = await fetchUbicaciones();
    selectUbicacion.innerHTML = '<option value="">Selecciona ubicación</option>';
    data.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = u.nombre;
      selectUbicacion.appendChild(opt);
    });
  }

  // preview de imagen
  inputImagen.addEventListener('change', () => {
    const file = inputImagen.files[0];
    nombreArchivo.textContent = file ? `Seleccionado: ${file.name}` : '';
    if (file) {
      validarImagen(inputImagen, 'icon-imagen');
      const reader = new FileReader();
      reader.onload = e => {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      preview.src = '';
      preview.style.display = 'none';
    }
  });

  // submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!confirm('¿Confirmas que deseas añadir esta impresora?')) return;

    const texto = await setImpresora(new FormData(form));
    if (texto.trim() === 'OK') {
      alert('Impresora registrada.');
      form.reset();
      modal.classList.add('hidden');
      window.dispatchEvent(new Event('recargar-impresoras'));
    } else {
      alert('Error: ' + texto);
    }
  });
}