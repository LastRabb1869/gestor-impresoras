import { initModalConfirm, initModalError } from '../ui/modal-mensaje.js';
import { setImpresora } from './printers-api.js';

export function initModalVerImpresora() {
  const modal   = document.getElementById('modal-ver-impresora');
  const content = modal.querySelector('.contenido .grid');
  const btnEdit = modal.querySelector('#btn-editar');
  const btnCan  = modal.querySelector('#btn-cancelar');
  const btnSave = modal.querySelector('#btn-guardar');
  let currentData = null;

  // Helper: toggle edit mode
  function toggleEditMode(editing) {
    modal.querySelectorAll('span[data-field]').forEach(el => el.classList.toggle('hidden', editing));
    modal.querySelectorAll('.input-editar').forEach(el => el.classList.toggle('hidden', !editing));
    btnEdit.classList.toggle('hidden', editing);
    btnCan.classList.toggle('hidden', !editing);
    btnSave.classList.toggle('hidden', !editing);
  }

  // Populate selects for ubicaciones y responsables
  async function populateSelects(data) {
    const ubiSel = content.querySelector('select[data-field="ubicacion_id"]');
    const respSel = content.querySelector('select[data-field="responsable_id"]');

    // Ubicaciones
    const resU = await fetch('get_cards/get_ubicaciones.php');
    const ubs = await resU.json();
    ubiSel.innerHTML = ubs.map(u =>
      `<option value="${u.id}"${u.id===data.ubicacion_id? ' selected':''}>${u.nombre}</option>`
    ).join('');

    // Responsables
    const resR = await fetch('get_cards/get_responsables.php');
    const rs  = await resR.json();
    respSel.innerHTML = ['<option value="">— Ninguno —</option>',
      ...rs.map(r => `
        <option value="${r.num_colaborador}"${r.num_colaborador===data.responsable_id? ' selected':''}>
          ${r.nombre} ${r.apellido}
        </option>`)
    ].join('');
  }

  // 1) Bind expand buttons dynamically
  document.addEventListener('recargar-impresoras', bindExpandButtons);
  function bindExpandButtons() {
    document.querySelectorAll('.expand-button').forEach(btn => {
      btn.onclick = async () => {
        const id = parseInt(btn.dataset.id, 10);
        const resp = await fetch(`get_cards/view_impresora.php?id=${id}`);
        const data = await resp.json();
        currentData = data;

        // Fill fields
        ['nombre','marca','modelo','num_serie','ip','estado','fecha_agregada','fecha_comprada'].forEach(field => {
          const span = content.querySelector(`span[data-field="${field}"]`);
          const input = content.querySelector(`input[data-field="${field}"]`);
          const select = content.querySelector(`select[data-field="${field}"]`);
          if (span) span.textContent = field.includes('fecha') ?
            (data[field] ? new Date(data[field]).toLocaleDateString() : '—') : data[field] || '—';
          if (input) input.value = field==='fecha_comprada' ? (data.fecha_comprada?.slice(0,10)||'') : data[field] || '';
          if (select) select.value = data[field];
        });

        // Imagen
        const imgEl = content.querySelector('img[data-field="imagen"]');
        imgEl.src = `../assets/sources/printers/${data.num_serie}/img/${data.imagen||'default-impresora.jpg'}`;

        // Populate dynamic selects
        await populateSelects(data);

        // Reset to view mode
        toggleEditMode(false);
        modal.classList.remove('hidden');
      };
    });
  }
  bindExpandButtons();

  // 2) Edit, Cancel, Save
  btnEdit.onclick = () => toggleEditMode(true);
  btnCan.onclick = () => modal.classList.add('hidden');

  btnSave.onclick = async () => {
    const ok = await initModalConfirm('Guardar cambios', '¿Deseas guardar los cambios?');
    if (!ok) return;

    // Build FormData
    const form = new FormData();
    form.append('id', currentData.id);
    ['nombre','marca','modelo','num_serie','ip','estado','ubicacion_id','responsable_id','fecha_comprada']
      .forEach(field => {
        const el = content.querySelector(`[data-field="${field}"]`);
        form.append(field, el.value || el.textContent);
      });

    try {
      const respText = await setImpresora(form);
      if (respText.trim() === 'OK') {
        initModalError('¡Listo!', 'Datos actualizados correctamente.', 'success');
        modal.classList.add('hidden');
        window.dispatchEvent(new Event('recargar-impresoras'));
      } else {
        throw new Error(respText);
      }
    } catch (err) {
      initModalError('Error al guardar', err.message, 'error');
    }
  };
}