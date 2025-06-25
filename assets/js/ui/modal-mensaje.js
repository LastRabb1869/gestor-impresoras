// assets/js/ui/modal-mensaje.js

export function initModalError(titulo, texto, tipo = 'error') {
  const modal  = document.getElementById('modal-mensaje');
  const tituloEl   = modal.querySelector('#modal-mensaje-titulo');
  const contenidoEl= modal.querySelector('#modal-mensaje-contenido');
  const closeBtn   = modal.querySelector('.modal-close');
  const okBtn      = modal.querySelector('#modal-mensaje-ok');

  // Ajustar contenido y clase
  modal.classList.remove('hidden', 'error', 'success');
  modal.classList.add(tipo);
  tituloEl.textContent    = titulo;
  contenidoEl.textContent = texto;

  // Abrir modal
  modal.classList.remove('hidden');

  // Cerrar al hacer click en X o Aceptar
  function cerrar() {
    modal.classList.add('hidden');
  }
  closeBtn.onclick = cerrar;
  okBtn.onclick    = cerrar;
}
