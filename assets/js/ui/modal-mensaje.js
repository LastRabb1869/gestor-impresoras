// assets/js/ui/modal-mensaje.js
const modalMsg   = document.getElementById('modal-mensaje');
const titulo     = modalMsg.querySelector('#modal-mensaje-titulo');
const contenido  = modalMsg.querySelector('#modal-mensaje-contenido');
const btnOk      = modalMsg.querySelector('#modal-mensaje-ok');
const btnCancel  = modalMsg.querySelector('#modal-mensaje-cancel');
const btnClose   = modalMsg.querySelector('.modal-close');

let _confirmResolve = null;

/* ---------- helpers ---------- */
function ocultar() {
  modalMsg.classList.add('hidden');
}
function resetClases() {
  modalMsg.classList.remove('success','error','confirm');
}

/* ---------- cierres ---------- */
function cerrarTodo(result = false) {
  ocultar();
  if (_confirmResolve) {
    _confirmResolve(result); // true si OK, false si Cancel/Cerrar
    _confirmResolve = null;
  }
}

btnClose .addEventListener('click', () => cerrarTodo(false));
btnCancel.addEventListener('click', () => cerrarTodo(false));
btnOk    .addEventListener('click', () => cerrarTodo(true));

/* ---------- API pública ---------- */

// mensaje simple
export function initModalError(title, msg, clase='error') {
  resetClases();
  titulo.textContent    = title;
  contenido.textContent = msg;
  modalMsg.classList.add(clase);
  btnCancel.style.display = 'none';   // sólo OK
  modalMsg.classList.remove('hidden');
}

// confirmación (devuelve Promise<boolean>)
export async function initModalConfirm(title, msg) {
  return new Promise(resolve => {
    resetClases();
    titulo.textContent    = title;
    contenido.textContent = msg;
    modalMsg.classList.add('confirm');
    btnCancel.style.display = 'inline-block'; // se muestra Cancelar
    _confirmResolve = resolve;
    modalMsg.classList.remove('hidden');
  });
}