// assets/js/ui/validation.js
import { svgAdvertencia, svgValidacion } from './icons.js';

export const reglas = {
    nombre: {
        regex: /^[a-zA-Z0-9 ._\-\(\)\[\]]+$/,
        mensaje: "Por favor, escribe un nombre válido (letras, números, guiones...)"
    },
    marca: {
        regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/,
        mensaje: "Solo letras y espacios son válidos."
    },
    modelo: {
        regex: /^[a-zA-Z0-9 ._\-\(\)\[\]]+$/,
        mensaje: "Modelo solo debe contener letras, números y guiones."
    },
    num_serie: {
        regex: /^[a-zA-Z0-9\-]+$/,
        mensaje: "Número de serie no debe contener espacios ni símbolos raros."
    },
    cantidad_stock: {
        regex: /^\d+$/,
        mensaje: "La cantidad en stock debe ser un número entero positivo."
    },
    ip: {
        regex: /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
        mensaje: "Introduce una dirección IP válida (ej. 10.180.0.151)"
    },
    select: {
        custom: val => val !== "",
        mensaje: "Debes seleccionar una opción válida."
    }
};

export function validarCampo(input) {
  const tipo    = input.dataset.type;
  const valor   = input.value.trim();
  const id      = input.id; // p.ej., "num_serie_componente"
  const icon    = document.getElementById(`icon-${id}`);
  const tip     = document.getElementById(`tooltip-${id}`);

  const regla = reglas[tipo];
  if (!regla) return;

  const esOk = regla.regex ? regla.regex.test(valor) : regla.custom(valor);

  if (esOk) {
    icon.classList.remove('error');
    icon.classList.add('ok');
    icon.innerHTML = svgValidacion;
    tip.style.display = 'none';
  } else {
    icon.classList.remove('ok');
    icon.classList.add('error');
    icon.innerHTML = svgAdvertencia;
    tip.textContent = regla.mensaje;
  }

  return esOk;
}

export function activarTooltipsValidacion() {
  document.querySelectorAll('.status-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const id = icon.id.replace('icon-', '');
      const tip = document.getElementById(`tooltip-${id}`);
      if (tip && icon.classList.contains('error')) {
        tip.style.display = tip.style.display === 'block' ? 'none' : 'block';
      }
    });
  });
}

export function initTooltipOutsideClick() {
  document.addEventListener('click', e => {
    if (!e.target.closest('.status-icon') && !e.target.closest('.tooltip')) {
      document.querySelectorAll('.tooltip').forEach(t => t.style.display = 'none');
    }
  });
}