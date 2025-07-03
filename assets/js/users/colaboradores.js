// assets/js/users/colaboradores.js

import { initModalConfirm, initModalError } from '../ui/modal-mensaje.js';

export function initColaboradoresSection() {
  const section = document.getElementById('colaboradores-section');
  if (!section) return;

  const btnToggle = section.querySelector('#colab-edit-toggle');
  let editMode = false;

  const tbColab = section.querySelector('.table-colab tbody');
  const tbUser  = section.querySelector('.table-users tbody');

  async function loadData() {
    const [respColab, respUser] = await Promise.all([
      fetch('get_cards/get_responsables.php').then(r => r.json()),
      fetch('get_cards/get_usuarios.php').then(r => r.json())
    ]);
    renderTable(tbColab, respColab, 'responsable');
    renderTable(tbUser,  respUser,  'usuario');
  }

  function renderTable(tbody, data, type) {
    tbody.innerHTML = '';
    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.dataset.id   = item.num_colaborador;
      tr.dataset.type = type;
      tr.innerHTML = `
        <td class="avatar-cell">
          <label class="avatar-wrapper">
            <img src="../assets/sources/users/${item.num_colaborador}/profile_img/${item.imagen_perfil||'default-user.png'}"/>
            <input type="file" accept=".jpg,.png" class="avatar-input" disabled>
          </label>
        </td>
        <td>${item.num_colaborador}</td>
        <td class="cell-nombre">${item.nombre}</td>
        <td class="cell-apellido">${item.apellido}</td>
        ${ type==='usuario'
          ? `<td class="cell-correo">${item.correo}</td>
             <td class="cell-nivel">${item.nivel}</td>`
          : `<td class="cell-ubicacion">${item.ubicacion_nombre||item.ubicacion_id}</td>`
        }
        <td>
          <div class="switch ${item.estado.toLowerCase()}" ></div>
        </td>
        ${ type==='responsable'
          ? `<td class="archivo-cell">
               <a href="../assets/sources/users/${item.num_colaborador}/archivo/${item.archivo}" target="_blank">Ver PDF</a>
               <input type="file" accept=".pdf" class="archivo-input" disabled>
             </td>`
          : `<td class="cell-password" data-real-pass="${item.contrasena}">
               <span class="masked">••••••</span>
               <button class="show-pass">👁</button>
             </td>`
        }
      `;
      tbody.appendChild(tr);
    });
    setEditMode(editMode);
  }

  function setEditMode(on) {
    editMode = on;
    btnToggle.textContent = on ? 'Guardar' : 'Editar';
    section.querySelectorAll('.avatar-input, .archivo-input')
           .forEach(i => i.disabled = !on);
    section.querySelectorAll('.switch')
           .forEach(sw => on ? sw.classList.add('can-toggle') : sw.classList.remove('can-toggle'));
    // Convertir nombre/apellido
    section.querySelectorAll('td.cell-nombre, td.cell-apellido').forEach(td => {
      const txt = td.textContent;
      if (on && !td.querySelector('input')) {
        td.innerHTML = `<input type="text" value="${txt}">`;
      } else if (!on && td.querySelector('input')) {
        td.textContent = td.querySelector('input').value;
      }
    });
  }

  btnToggle.addEventListener('click', async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }
    const ok = await initModalConfirm('Confirmar','¿Guardar cambios?');
    if (!ok) return;

    const tasks = [];
    section.querySelectorAll('tbody tr').forEach(tr => {
      const type = tr.dataset.type;  // "responsable" | "usuario"
      const id   = tr.dataset.id;
      const fd = new FormData();
      fd.append('num_colaborador', id);
      fd.append('nombre',   tr.querySelector('.cell-nombre input').value);
      fd.append('apellido', tr.querySelector('.cell-apellido input').value);
      const estado = tr.querySelector('.switch').classList.contains('baja') ? 'BAJA' : 'ALTA';
      fd.append('estado', estado);

      const avatarFile = tr.querySelector('.avatar-input').files[0];
      if (avatarFile) fd.append('imagen', avatarFile);

      if (type === 'responsable') {
        const pdfFile = tr.querySelector('.archivo-input').files[0];
        if (pdfFile) fd.append('archivo', pdfFile);
      } else {
        // nivel editable?
        const nivelCell = tr.querySelector('.cell-nivel');
        if (nivelCell) {
          const nivel = nivelCell.textContent.trim();
          fd.append('nivel', nivel);
        }
      }

      tasks.push(
        fetch(`set_info/update_${type}.php`, { method:'POST', body:fd })
          .then(r => r.json())
          .then(json => {
            if (!json.success) throw new Error(json.message);
          })
      );
    });

    try {
      await Promise.all(tasks);
      initModalError('¡Éxito!','Cambios guardados.','success');
      setTimeout(loadData, 500);
    } catch (err) {
      initModalError('ERROR', err.message,'error');
    }
  });

  // toggle switch
  section.addEventListener('click', e => {
    if (!editMode) return;
    const sw = e.target.closest('.switch.can-toggle');
    if (!sw) return;
    sw.classList.toggle('alta');
    sw.classList.toggle('baja');
  });

  // mostrar contraseña
  section.addEventListener('click', e => {
    if (!e.target.matches('.show-pass')) return;
    const cell = e.target.closest('.cell-password');
    const span = cell.querySelector('.masked');
    span.textContent = span.textContent==='••••••'
      ? cell.dataset.realPass
      : '••••••';
  });

  loadData();
}