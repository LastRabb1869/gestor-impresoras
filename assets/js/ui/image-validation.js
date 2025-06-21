// assets/js/ui/image-validation.js
import { svgAdvertencia, svgValidacion } from './icons.js';

export function validarImagen(inputImagen, iconoId) {
  const file = inputImagen.files[0];
  const icon = document.getElementById(iconoId);
  if (file && ['image/jpeg','image/png'].includes(file.type) && file.size <= 5*1024*1024) {
    icon.classList.replace('error','ok');
    icon.innerHTML = svgValidacion;
    return true;
  } else {
    icon.classList.replace('ok','error');
    icon.innerHTML = svgAdvertencia;
    return false;
  }
}