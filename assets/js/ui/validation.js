// assets/js/ui/validation.js

export const reglas = {
  nombre: {
    regex: /^[a-zA-Z0-9 ._\-\(\)\[\]]+$/,
    mensaje: "Por favor, escribe un nombre válido (letras, números, guiones…)"
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
  perfil_nombre: {
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/,
    mensaje: "En el nombre, solo letras, acentos y espacios son válidos."
  },
  perfil_apellido: {
    regex: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/,
    mensaje: "En el apellido, solo letras, acentos y espacios son válidos."
  },
  select: {
    custom: v => v !== "",
    mensaje: "Debes seleccionar una opción válida."
  }
};

export function validateField(input) {
  const modal   = input.closest('.modal-overlay');
  const wrapper = input.closest('.input-wrapper');
  const tooltip = modal.querySelector(`#tooltip-${input.id}`);
  const tipo    = input.dataset.type;
  const valor   = input.value.trim();
  const regla   = reglas[tipo];
  if (!regla) return true;

  const esOk = regla.regex ? regla.regex.test(valor) : regla.custom(valor);

  // Limpiar
  wrapper.classList.remove('error','success');
  tooltip.textContent = '';

  if (esOk) {
    wrapper.classList.add('success');
    return true;
  } else {
    wrapper.classList.add('error');
    tooltip.textContent = regla.mensaje;
    return false;
  }
}

export function initFieldValidation(modal) {
  modal.querySelectorAll('.validable').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('focus', () => {
      const wrapper = input.closest('.input-wrapper');
      wrapper.classList.remove('error','success');
    });
  });
}

export function initImageValidation(modal, inputSelector, previewSelector, placeholderSelector) {
  const input       = modal.querySelector(inputSelector);
  const preview     = modal.querySelector(previewSelector);
  const placeholder = modal.querySelector(placeholderSelector);

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) {
      placeholder.style.display = 'block';
      preview.style.display     = 'none';
      return;
    }
    placeholder.style.display = 'none';
    const reader = new FileReader();
    reader.onload = e => {
      preview.src           = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });
}

export function resetFieldValidation(modal) {
  modal.querySelectorAll('.input-wrapper').forEach(wrapper => {
    wrapper.classList.remove('error', 'success');
  });
  modal.querySelectorAll('.tooltip').forEach(tooltip => {
    tooltip.textContent = '';
  });
}