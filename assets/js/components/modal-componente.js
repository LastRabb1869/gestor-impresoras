// assets/js/components/modal-componente.js

import { cargarUbicaciones } from '../departaments/departaments-api.js';
import { setComponente } from './components-api.js';
import { validarCampo, activarTooltipsValidacion, initTooltipOutsideClick } from '../ui/validation.js';
import { validarImagen } from '../ui/image-validation.js';

export function initModalComponente() {
  const modal = document.getElementById('modal-componente');
  const form = document.getElementById('form-componente');
  const inputImagen = document.getElementById('imagen_componente');
  const nombreArchivo = document.getElementById('nombre-archivo_componente');
  const preview = modal.querySelector('#preview-img_componente');
  const placeholder = modal.querySelector('.placeholder-text');

  // validaciones a los campos “validable”
  document.querySelectorAll('.validable').forEach(input =>
    input.addEventListener('blur', () => validarCampo(input))
  );

  // escuchador para mostrar el modal
  window.addEventListener('abrir-modal-componente', () => {
    modal.classList.remove('hidden');
    cargarUbicaciones('select-ubicacion-componente');
    activarTooltipsValidacion();
    initTooltipOutsideClick();  
    // limpiar estado previo
    form.reset();
    preview.style.display = 'none';
    placeholder.style.display = 'block';
    nombreArchivo.textContent = '';
    modal.querySelectorAll('.status-icon').forEach(icon => {
      icon.classList.remove('ok','error');
      icon.innerHTML = '';
    });    
  });

  // cerrar
  function cerrarModal() {
    if (confirm('¿Deseas cancelar el registro del componente?')) {


      modal.classList.add('hidden');
    }
  }
  modal.querySelector('.modal-close').addEventListener('click', cerrarModal);
  modal.querySelector('.btn-cancel').addEventListener('click', cerrarModal);

  // preview de imagen
  inputImagen.addEventListener('change', () => {
    const file = inputImagen.files[0];
    if (file) {
      placeholder.style.display = 'none';
      nombreArchivo.textContent = `Seleccionado: ${file.name}`;
      validarImagen(inputImagen, 'icon-imagen_componente');
      const reader = new FileReader();
      reader.onload = e => {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      placeholder.style.display = 'block';
      nombreArchivo.textContent = '';
      preview.style.display = 'none';
    }
  });

  // submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!confirm('¿Confirmas que deseas añadir este componente?')) return;

    const texto = await setComponente(new FormData(form));
    if (texto.trim() === 'OK') {
      alert('¡Componente registrado exitosamente!');
      cerrarModal();
      window.dispatchEvent(new Event('recargar-componentes'));
    } else {
      alert('Error: ' + texto);
    }
  });
}