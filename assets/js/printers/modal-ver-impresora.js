// assets/js/printers/modal-ver-impresora.js

import { initModalConfirm, initModalError } from '../ui/modal-mensaje.js';
import { initFieldValidation, resetFieldValidation } from '../ui/validation.js';
import { setImpresora } from './printers-api.js';

export function initModalVerImpresora() {
  const modal     = document.getElementById('modal-ver-impresora');
  const headerImg = modal.querySelector('.modal-header-image');
  const grid      = modal.querySelector('.contenido .grid');
  const btnClose  = modal.querySelector('.modal-close');
  const btnEdit   = modal.querySelector('#btn-editar');
  const btnCan    = modal.querySelector('#btn-cancelar');
  const btnSave   = modal.querySelector('#btn-guardar');
  let currentData = {};

  // 1) Cerrar modal
  btnClose.addEventListener('click', () => modal.classList.add('hidden'));
  btnCan  .addEventListener('click', () => modal.classList.add('hidden'));

  // 2) Alterna modo edición: habilita/deshabilita campos y tooltips
  function toggleEditMode(editing) {
    // inputs y selects
    grid.querySelectorAll('.field-input').forEach(el => {
      if (el.tagName === 'INPUT') {
        editing ? el.removeAttribute('readonly') : el.setAttribute('readonly', '');
      } else {  // SELECT
        el.disabled = !editing;
      }
    });

    // inicializar o limpiar validación
    if (editing) {
      initFieldValidation(modal);
    } else {
      resetFieldValidation(modal);
    }

    // botones
    btnEdit.classList.toggle('hidden', editing);
    btnCan .classList.toggle('hidden', !editing);
    btnSave.classList.toggle('hidden', !editing);
  }

  // 3) Rellena todos los campos con data del servidor
  function populateFields(data) {
    // imagen de fondo
    headerImg.style.backgroundImage =
      `url("../assets/sources/printers/${data.num_serie}/img/${data.imagen||'default-impresora.jpg'}")`;

    // texto y IP
    ['nombre','marca','modelo','num_serie','ip'].forEach(field => {
      const el = grid.querySelector(`[data-field="${field}"]`);
      if (!el) return;
      el.value = (field === 'ip' ? data.direccion_ip : data[field]) || '';
    });

    // fechas
    const fa = grid.querySelector('[data-field="fecha_agregada"]');
    if (fa) fa.value = data.fecha_agregada
      ? new Date(data.fecha_agregada).toLocaleDateString()
      : '';

    const fc = grid.querySelector('[data-field="fecha_comprada"]');
    if (fc) fc.value = data.fecha_comprada
      ? data.fecha_comprada.slice(0,10)
      : '';

    // estado
    const estadoEl = grid.querySelector('[data-field="estado"]');
    if (estadoEl) estadoEl.value = data.estado;
  }

  // 4) Carga dinámicamente ubicaciones y responsables
  async function populateSelects(data) {
    // ubicaciones
    const ubs   = await (await fetch('get_cards/get_ubicaciones.php')).json();
    const ubiEl = grid.querySelector('[data-field="ubicacion_id"]');
    ubiEl.innerHTML = ubs.map(u =>
      `<option value="${u.id}"${u.id===data.ubicacion_id? ' selected':''}>${u.nombre}</option>`
    ).join('');

    // responsables
    const rs     = await (await fetch('get_cards/get_responsables.php')).json();
    const respEl = grid.querySelector('[data-field="responsable_id"]');
    respEl.innerHTML = [
      `<option value="">— Ninguno —</option>`,
      ...rs.map(r => 
        `<option value="${r.num_colaborador}"${r.num_colaborador===data.responsable_id? ' selected':''}>
           ${r.nombre} ${r.apellido}
         </option>`
      )
    ].join('');
  }

  // 5) Asocia los botones “Ver” (se ejecuta tras cada render de tarjetas)
  function bindExpandButtons() {
    document.querySelectorAll('.expand-button').forEach(btn => {
      btn.onclick = async () => {
        const id = +btn.dataset.id;
        currentData = await (await fetch(`get_cards/view_impresora.php?id=${id}`)).json();
        populateFields(currentData);
        await populateSelects(currentData);
        toggleEditMode(false);
        modal.classList.remove('hidden');
      };
    });
  }
  bindExpandButtons();
  window.addEventListener('recargar-impresoras', bindExpandButtons);

  // 6) Editar / Guardar
  btnEdit.addEventListener('click', () => toggleEditMode(true));

  btnSave.addEventListener('click', async () => {
    const ok = await initModalConfirm('Guardar cambios','¿Deseas guardar los cambios?');
    if (!ok) return;

    // armamos FormData
    const form = new FormData();
    form.append('id', currentData.id);
    ['nombre','marca','modelo','num_serie','ip','estado','ubicacion_id','responsable_id','fecha_comprada']
      .forEach(field => {
        const el = grid.querySelector(`[data-field="${field}"]`);
        form.append(field, el.value || '');
      });

    try {
      const res = await setImpresora(form);
      if (res.trim() === 'OK') {
        initModalError('¡Listo!','Datos actualizados correctamente.','success');
        modal.classList.add('hidden');
        window.dispatchEvent(new Event('recargar-impresoras'));
      } else {
        throw new Error(res);
      }
    } catch (err) {
      initModalError('Error al guardar', err.message, 'error');
    }
  });
}