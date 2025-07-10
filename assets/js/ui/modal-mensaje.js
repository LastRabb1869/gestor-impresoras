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

export function initModalPrompt(title, msg) {
  return new Promise(resolve => {
    // Recojo elementos ya existentes
    const modal = document.getElementById('modal-mensaje');
    const h2    = modal.querySelector('#modal-mensaje-titulo');
    const p     = modal.querySelector('#modal-mensaje-contenido');
    const btnOk = modal.querySelector('#modal-mensaje-ok');
    const btnCancel = modal.querySelector('#modal-mensaje-cancel');
    const btnClose  = modal.querySelector('.modal-close');

    // Crea o reutiliza un input dentro del <p>
    p.innerHTML = `<p>${msg}</p><input id="modal-prompt-input" type="password" style="width:100%;padding:0.5rem;margin-top:0.5rem;" />`;
    h2.textContent = title;

    // Clases de estado
    modal.classList.remove('hidden','success','error','confirm');
    modal.classList.add('confirm');

    // Limpio event listeners antiguos
    btnOk.replaceWith(btnOk.cloneNode(true));
    btnCancel.replaceWith(btnCancel.cloneNode(true));
    btnClose.replaceWith(btnClose.cloneNode(true));

    const newOk     = modal.querySelector('#modal-mensaje-ok');
    const newCancel = modal.querySelector('#modal-mensaje-cancel');
    const newClose  = modal.querySelector('.modal-close');
    const input     = modal.querySelector('#modal-prompt-input');

    // Cuando acepte
    newOk.addEventListener('click', () => {
      const val = input.value.trim();
      modal.classList.add('hidden');
      resolve(val || null);
    });

    // Cuando cancele o cierre
    function onCancel() {
      modal.classList.add('hidden');
      resolve(null);
    }
    newCancel.addEventListener('click', onCancel);
    newClose .addEventListener('click', onCancel);

    // Foco al input
    input.focus();
  });
}