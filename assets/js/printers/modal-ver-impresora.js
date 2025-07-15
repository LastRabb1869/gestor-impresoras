import { initModalConfirm, initModalError } from '../ui/modal-mensaje.js';
import { setImpresora } from './printers-api.js';

export function initModalVerImpresora() {
  const modal = document.getElementById('modal-ver-impresora');
  const headerImg = modal.querySelector('.modal-header-image');
  const grid = modal.querySelector('.contenido .grid');
  const btnClose = modal.querySelector('.modal-close');
  const btnEdit = modal.querySelector('#btn-editar');
  const btnCan = modal.querySelector('#btn-cancelar');
  const btnSave = modal.querySelector('#btn-guardar');
  let currentData = {};

  // Cierra modal
  btnClose.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Alterna readonly/disabled
  function toggleEditMode(editing) {
    grid.querySelectorAll('.field-input').forEach(el => {
      if (el.tagName === 'INPUT') {
        editing ? el.removeAttribute('readonly') : el.setAttribute('readonly', '');
      } else if (el.tagName === 'SELECT') {
        el.disabled = !editing;
      }
    });
    btnEdit.classList.toggle('hidden', editing);
    btnCan.classList.toggle('hidden', !editing);
    btnSave.classList.toggle('hidden', !editing);
  }

  // Rellena todos los campos
  function populateFields(data) {
    // Header image
    headerImg.style.backgroundImage =
      `url("../assets/sources/printers/${data.num_serie}/img/${data.imagen||'default-impresora.jpg'}")`;

    // Campos de texto simples (incluimos IP aquí)
    ['nombre','marca','modelo','num_serie','ip'].forEach(field => {
      const el = grid.querySelector(`[data-field="${field}"]`);
      if (!el) return;
      // Para ip usamos data.direccion_ip
      if (field === 'ip') {
        el.value = data.direccion_ip || '';
      } else {
        el.value = data[field] || '';
      }
    });

    // Fechas
    const fa = grid.querySelector('input[data-field="fecha_agregada"]');
    if (fa) {
      fa.value = data.fecha_agregada
        ? new Date(data.fecha_agregada).toLocaleDateString()
        : '—';
      fa.setAttribute('readonly','');
    }
    const fc = grid.querySelector('input[data-field="fecha_comprada"]');
    if (fc) {
      fc.value = data.fecha_comprada ? data.fecha_comprada.slice(0,10) : '';
      fc.setAttribute('readonly','');
    }

    // Selects (estado)
    const estadoEl = grid.querySelector('select[data-field="estado"]');
    if (estadoEl) estadoEl.value = data.estado;
  }

  // Poblado de select dinámicos
  async function populateSelects(data) {
    // Ubicaciones
    const ubs = await (await fetch('get_cards/get_ubicaciones.php')).json();
    const ubiEl = grid.querySelector('select[data-field="ubicacion_id"]');
    ubiEl.innerHTML = ubs.map(u =>
      `<option value="${u.id}"${u.id===data.ubicacion_id? ' selected':''}>${u.nombre}</option>`
    ).join('');

    // Responsables
    const rs = await (await fetch('get_cards/get_responsables.php')).json();
    const respEl = grid.querySelector('select[data-field="responsable_id"]');
    respEl.innerHTML = [
      '<option value="">— Ninguno —</option>',
      ...rs.map(r =>
        `<option value="${r.num_colaborador}"${r.num_colaborador===data.responsable_id? ' selected':''}>
           ${r.nombre} ${r.apellido}
         </option>`
      )
    ].join('');
  }

  // Engancha botones "Ver"
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

  // Botones de control
  btnCan.onclick = () => modal.classList.add('hidden');
  btnEdit.onclick = () => toggleEditMode(true);
  btnSave.onclick = async () => {
    if (!await initModalConfirm('Guardar cambios','¿Deseas guardar los cambios?')) return;
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
    } catch (e) {
      initModalError('Error al guardar', e.message, 'error');
    }
  };
}