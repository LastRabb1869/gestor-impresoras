// assets/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  // — Elementos principales —
  const navItems            = document.querySelectorAll('.nav-item[data-section]');
  const sections            = document.querySelectorAll('.dashboard-section');
  const sidebar             = document.querySelector('.sidebar');
  const impresorasSection   = document.getElementById('impresoras-section');
  const componentesSection  = document.getElementById('componentes-section');
  const alertasSection      = document.getElementById('alertas-section');
  const cambiosSection      = document.getElementById('cambios-section');
  const searchBar           = document.getElementById('searchBar');
  const mobileMain = document.querySelectorAll('.mobile-nav-main li');
  const mobileSubs  = document.querySelectorAll('.mobile-nav-sub');
  const modal = document.getElementById('modal-impresora');
  const btnClose = modal.querySelector('.modal-close');
  const btnCancel = modal.querySelector('.btn-cancel');
  const form = document.getElementById('form-impresora');
  const selectUbicacion = document.getElementById('select-ubicacion');
  const inputImagen = document.getElementById('imagen');
  const nombreArchivo = document.getElementById('nombre-archivo');
  // const campoNombre = document.getElementById('nombre');
  // const iconoNombre = document.getElementById('icon-nombre');
  // const tooltipNombre = document.getElementById('tooltip-nombre');

  const svgAdvertencia = `
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradWarn" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ff4d4d"/>
        <stop offset="100%" stop-color="#e60000"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="11" fill="url(#gradWarn)" stroke="#b30000" stroke-width="2"/>
    <line x1="12" y1="7" x2="12" y2="14" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="17" r="1.5" fill="#fff"/>
  </svg>
  `;

  const svgValidacion = `
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradOk" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#66ff66"/>
        <stop offset="100%" stop-color="#00cc00"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="11" fill="url(#gradOk)" stroke="#009900" stroke-width="2"/>
    <polyline points="8,12.5 11,15.5 16,9.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
  
  document.querySelectorAll('.validable').forEach(input => {
    input.addEventListener('blur', () => validarCampo(input));
  });

  // — Menú móvil: conmutar grupos y mostrar su sub-lista —

  function hideAllSubs() {
  mobileSubs.forEach(ul => ul.style.display = 'none');
  }

  mobileMain.forEach(btn => {
    btn.addEventListener('click', e => {
      // 1) marca activo
      e.stopPropagation();
      mobileMain.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // 2) muestra sólo su submenú
      const group = btn.dataset.group;            // ej. "principal"
      hideAllSubs();
      const subUl = document.querySelector(`.mobile-nav-sub.${group}`);
      if (subUl) subUl.style.display = 'flex';
    });
  });

  // click en sub-items: navega a sección y oculta
  document.querySelectorAll('.mobile-nav-sub li').forEach(item => {
    item.addEventListener('click', e => {
      e.stopPropagation(); // evita que se cierre el menú al hacer click
      const section = item.dataset.section;
      if (section) {
        document.querySelector(`.nav-item[data-section="${section}"]`).click();
      }
        hideAllSubs();
    });
  });

  // click fuera: cierra submenus
  document.addEventListener('click', e => {
    // si no es click dentro de .mobile-nav
    if (!e.target.closest('.mobile-nav')) {
      hideAllSubs();
    }
  });

  // — Carga dinámicamente las impresoras —
  //El "<img src="../assets/img/printers/${c.num_serie}/${c.imagen || 'default-impresora.jpg'}" alt="${c.nombre}">" es diferente aquí que en los demás porque esto se lo cambié yo
  // eventualmente se lo estaría cambiando a todos los demás cuando estén listos los demás formularios
  function cargarImpresoras() {
    fetch('get_cards/get_impresoras.php')
      .then(res => res.json())
      .then(data => {
        const cont = impresorasSection.querySelector('.cards-container');
        cont.innerHTML = '';
        if (!data.length) return cont.innerHTML = '<p>No hay impresoras.</p>';
        data.forEach(c => {
          const card = document.createElement('div');
          card.className = 'card impresora-card';
          card.dataset.estado = c.estado;
          card.innerHTML = `
            <div class="card-img">
              <img src="../assets/img/printers/${c.num_serie}/${c.imagen || 'default-impresora.jpg'}" alt="${c.nombre}">
            </div>
            <div class="card-info">
              <h3>${c.nombre}</h3>
              <p><strong>Serie:</strong> ${c.num_serie}</p>
              <p><strong>Marca:</strong> ${c.marca}</p>
              <p><strong>Ubicación:</strong> ${c.ubicacion}</p>
              <p><strong>Estado:</strong> ${c.estado}</p>
              <button class="expand-button" data-id="${c.id}">Ver</button>
            </div>`;
          cont.appendChild(card);
        });
      })
      .catch(err => console.error('Hubo un error al cargar las impresoras: ', err));
  }

  // --- Control modal de nueva impresora ---
  function abrirModalImpresora() {
    modal.classList.remove('hidden');
    cargarUbicaciones();
  }

  function cerrarModal() {
    if (confirm('¿Deseas cancelar el registro de la impresora?')) {
      form.reset();

      // Limpiar íconos y tooltips de validación
      document.querySelectorAll('.status-icon').forEach(icon => {
        icon.classList.remove('error', 'ok');
        icon.innerHTML = '';
      });
      document.querySelectorAll('.tooltip').forEach(tip => {
        tip.style.display = 'none';
      });

      // Limpiar imagen subida si hay vista previa
      const vistaPrevia = document.querySelector('.image-box img');
      if (vistaPrevia) {
        vistaPrevia.remove();
      }
      document.getElementById('nombre-archivo').textContent = '';

      modal.classList.add('hidden');
    }
  }

  btnClose.addEventListener('click', cerrarModal);
  btnCancel.addEventListener('click', cerrarModal);

  // - Para añadir impresoras -
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!confirm('¿Confirmas que deseas añadir esta impresora?')) return;

    const formData = new FormData(form);

    fetch('set_info/set_impresoras.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(resp => {
      if (resp.trim() === 'OK') {
        alert('Impresora registrada exitosamente.');
        form.reset();
        modal.classList.add('hidden');
        cargarImpresoras(); // recargar tarjetas
      } else {
        alert('Error: ' + resp);
      }
    })
    .catch(err => {
      console.error('Error al enviar:', err);
      alert('Error al enviar los datos.');
    });
  });

  function validarImagen() {
    const file = inputImagen.files[0];
    const icon = document.getElementById('icon-imagen');
    // const tooltip = document.getElementById('tooltip-imagen');

    if (file && ['image/jpeg', 'image/png'].includes(file.type) && file.size <= 5 * 1024 * 1024) {
      icon.classList.remove('error');
      icon.classList.add('ok');
      icon.innerHTML = svgValidacion;
      // tooltip.style.display = 'none';
      return true;
    } else {
      icon.classList.remove('ok');
      icon.classList.add('error');
      icon.innerHTML = svgAdvertencia;
      return false;
    }
  }  
  
  inputImagen.addEventListener('change', () => {
    const texto = document.getElementById('placeholder-text');
    if (inputImagen.files.length > 0) {
      document.getElementById('uploading').style.display = 'block';
      const file = inputImagen.files[0];
      texto.style.display = 'none';
      document.getElementById('uploading').style.display = 'none';
      nombreArchivo.textContent = `Seleccionado: ${file.name}`;

      // Mostrar preview
      const preview = document.getElementById('preview-img');
      const reader = new FileReader();
      reader.onload = e => {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      texto.style.display = 'block';
      nombreArchivo.textContent = '';
      document.getElementById('uploading').style.display = 'none';
      document.getElementById('preview-img').style.display = 'none';
    }
    validarImagen();
  });

  const validaciones = {
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
    ip: {
      regex: /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
      mensaje: "Introduce una dirección IP válida (ej. 10.180.0.151)"
    },
    select: {
      custom: val => val !== "",
      mensaje: "Debes seleccionar una opción válida."
    }
  };

  document.querySelectorAll('.status-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const id = icon.id.replace('icon-', '');
      const tooltip = document.getElementById(`tooltip-${id}`);
      if (icon.classList.contains('error')) {
        tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
      }
    });
  });

  function validarCampo(input) {
    const tipo = input.dataset.type;
    const valor = input.value.trim();
    const icon = document.getElementById(`icon-${input.id}`);
    const tooltip = document.getElementById(`tooltip-${input.id}`);

    const regla = validaciones[tipo];
    if (!regla) return;

    const esValido = regla.regex ? regla.regex.test(valor) : regla.custom(valor);

    if (esValido) {
      icon.classList.remove('error');
      icon.classList.add('ok');
      icon.innerHTML = svgValidacion;
      tooltip.style.display = 'none';
    } else {
      icon.classList.remove('ok');
      icon.classList.add('error');
      icon.innerHTML = svgAdvertencia;
      tooltip.textContent = regla.mensaje;
      // tooltip.style.display = 'block'; Por el momento no se muestra el tooltip
    }

    return esValido;
  }

  // - Cargar ubicaciones dinámicamente -
  function cargarUbicaciones() {
    fetch('get_cards/get_ubicaciones.php')
      .then(res => res.json())
      .then(data => {
        selectUbicacion.innerHTML = '<option value="">Selecciona ubicación</option>';
        data.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.id;
          opt.textContent = `${u.nombre} (${u.tipo})`;
          selectUbicacion.appendChild(opt);
        });
      });
  }

  // — Carga dinámicamente los componentes —
  function cargarComponentes() {
    fetch('get_cards/get_componentes.php')
      .then(res => res.json())
      .then(data => {
        const cont = componentesSection.querySelector('.cards-container');
        cont.innerHTML = '';
        if (!data.length) return cont.innerHTML = '<p>No hay componentes.</p>';
        data.forEach(c => {
          const card = document.createElement('div');
          card.className = 'card componente-card';
          card.dataset.estado = c.estado;
          card.innerHTML = `
            <div class="card-img">
              <img src="../assets/img/${c.imagen || 'default-componente.jpg'}" alt="${c.nombre}">
            </div>
            <div class="card-info">
              <h3>${c.nombre}</h3>
              <p><strong>Serie:</strong> ${c.num_serie}</p>
              <p><strong>Marca:</strong> ${c.marca}</p>
              <p><strong>Ubicación:</strong> ${c.ubicacion}</p>
              <p><strong>Estado:</strong> ${c.estado}</p>
              <p><strong>Stock:</strong> ${c.cantidad_stock}</p>
              <button class="expand-button" data-id="${c.id}">Ver</button>
            </div>`;
          cont.appendChild(card);
        });
      })
      .catch(err => console.error('Hubo un error al cargar los componentes: ', err));
  }

  // — Carga dinámicamente alertas —
  // Falta la sección de imágenes de alertas
  function cargarAlertas() {
    fetch('get_cards/get_alertas.php')
      .then(res => res.json())
      .then(data => {
        const cont = alertasSection.querySelector('.cards-container');
        cont.innerHTML = '';
        if (!data.length) return cont.innerHTML = '<p>No hay alertas pendientes.</p>';
        data.forEach(a => {
          const card = document.createElement('div');
          card.className = 'card alerta-card';
          card.dataset.estado = a.estado_actual;
          card.innerHTML = `
            <div class="card-info">
              <h3>Alerta # ${a.id} – Prioridad: ${a.prioridad}</h3>
              <p><strong>Impresora:</strong> ${a.impresora}</p>
              <p><strong>IP:</strong> ${a.direccion_ip}</p>
              <p><strong>Estado:</strong> ${a.estado_actual}</p>
              <p><strong>Reportado:</strong><small> ${a.fecha_hora}</small></p>
              <button class="expand-button" data-id="${a.id}">Ver</button>
            </div>`;
          cont.appendChild(card);
        });
      })
      .catch(console.error('Hubo un error al cargar las alertas: ', err));
  }

  // — Carga dinámicamente los cambios —
  function cargarCambios() {
    fetch('get_cards/get_cambios.php')
      .then(res => res.json())
      .then(data => {
        const cont = cambiosSection.querySelector('.cards-container');
        cont.innerHTML = '';
        if (!data.length) return cont.innerHTML = '<p>No hay cambios realizados.</p>';
        data.forEach(a => {
          const card = document.createElement('div');
          card.className = 'card cambio-card';
          card.innerHTML = `
            <div class="card-info">
              <h3>Cambio en impresora: ${a.impresora}</h3>
              <p><strong>Con S/N:</strong> ${a.num_serie}</p>
              <p><strong>Componente:</strong> ${a.componente}</p>
              <p><strong>Cambiado:</strong><small> ${a.fecha_hora}</small></p>
              <button class="expand-button" data-id="${a.id}">Ver</button>
            </div>`;
          cont.appendChild(card);
        });
      })
      .catch(console.error('Hubo un error al cargar los cambios de componentes: ', err));
  }

  // — Aplica filtro sobre impresoras —
  function applyPrinterFilter(filter) {
    document.querySelectorAll('#impresoras-section .impresora-card')
      .forEach(card => {
        const estado = card.dataset.estado;
        const ok = filter === 'todas'
                || (filter === 'operativas'    && estado === 'FUNCIONANDO')
                || (filter === 'con-problemas' && estado === 'CON PROBLEMAS')
                || (filter === 'reparando'     && estado === 'REPARANDO')
                || (filter === 'no-operativas' && estado === 'BAJA');
        card.style.display = ok ? 'flex' : 'none';
      });
  }

  // — Aplica filtro sobre componentes —
  function applyComponentFilter(filter) {
    document.querySelectorAll('#componentes-section .componente-card')
      .forEach(card => {
        const e = card.dataset.estado;
        const ok = filter === 'todos'
                || (filter === 'en-condiciones'  && e === 'EXCELENTES CONDICIONES')
                || (filter === 'posible-fallo'   && e === 'POSIBLE FALLO')
                || (filter === 'baja-definitiva' && e === 'BAJA DEFINITIVA')
                || (filter === 'desconocido'     && e === 'DESCONOCIDO')
                || (filter === 'sin-stock'       && e === 'SIN STOCK');
        card.style.display = ok ? 'flex' : 'none';
      });
  }

  // — Aplica filtro sobre alertas —
  function applyWarningFilter(filter) {
    document.querySelectorAll('#alertas-section .alerta-card')
      .forEach(card => {
        const es = card.dataset.estado;
        const ok = filter === 'todas'
                || (filter === 'completado'    && es === 'COMPLETADO')
                || (filter === 'en-proceso' && es === 'EN PROCESO')
                || (filter === 'sin-arreglo'     && es === 'SIN ARREGLO')
        card.style.display = ok ? 'flex' : 'none';
      });
  }

  // === Delegación de eventos ===
  // Impresoras
  impresorasSection.addEventListener('click', e => {
    if (e.target.closest('.filter-button')) {
      const btn = e.target.closest('.filter-button');
      impresorasSection.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyPrinterFilter(btn.dataset.filter);
      return;
    }
    if (e.target.closest('.expand-button')) {
      console.log('Ver impresora', e.target.closest('.expand-button').dataset.id);
    }
  });

  // Componentes
  componentesSection.addEventListener('click', e => {
    if (e.target.closest('.filter-button-comp')) {
      const btn = e.target.closest('.filter-button-comp');
      componentesSection.querySelectorAll('.filter-button-comp').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyComponentFilter(btn.dataset.filter);
      return;
    }
    if (e.target.closest('.expand-button')) {
      console.log('Ver componente', e.target.closest('.expand-button').dataset.id);
    }
  });

  // Alertas
  alertasSection.addEventListener('click', e => {
    if (e.target.closest('.filter-button-alt')) {
      const btn = e.target.closest('.filter-button-alt');
      alertasSection.querySelectorAll('.filter-button-alt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyWarningFilter(btn.dataset.filter);
      return;
    }
    if (e.target.closest('.expand-button')) {
      console.log('Ver arreglo', e.target.closest('.expand-button').dataset.id);
    }
  });

  // Navegación general
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // activa la pestaña
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      // muestra sección
      const target = item.dataset.section;
      sections.forEach(s => s.id === target ? s.classList.add('active') : s.classList.remove('active'));

      // inicializaciones según sección
      if (target === 'impresoras-section') {
        cargarImpresoras();
        impresorasSection.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
        impresorasSection.querySelector('.filter-button[data-filter="todas"]').classList.add('active');
        applyPrinterFilter('todas');
      }
      if (target === 'componentes-section') {
        cargarComponentes();
        componentesSection.querySelectorAll('.filter-button-comp').forEach(b => b.classList.remove('active'));
        componentesSection.querySelector('.filter-button-comp[data-filter="todos"]').classList.add('active');
        applyComponentFilter('todos');
      }
      if (target === 'alertas-section') {
        cargarAlertas();
        alertasSection.querySelectorAll('.filter-button-alt').forEach(b => b.classList.remove('active'));
        alertasSection.querySelector('.filter-button-alt[data-filter="todas"]').classList.add('active');
        applyWarningFilter('todas');
      }
      if (target === 'cambios-section') {
        cargarCambios();
      }
    });
  });

  // — FAB GLOBAL: toggle y navegación —
  const fabToggle  = document.getElementById('fab-toggle');
  const fabOptions = document.querySelector('.fab-options');

  fabToggle.addEventListener('click', e => {
    e.stopPropagation();
    fabOptions.classList.toggle('hidden');
  });

  // ocultar si clic fuera
  document.addEventListener('click', () => {
    fabOptions.classList.add('hidden');
  });

  // para cada opción, navegar a la sección correspondiente
  fabOptions.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const action = btn.dataset.action; // 'impresora'|'componente'|'alerta'|'cambio'
      let navButton;
      switch(action) {
        case 'impresora':
          navButton = document.querySelector('.nav-item[data-section="impresoras-section"]');
          break;
        case 'componente':
          navButton = document.querySelector('.nav-item[data-section="componentes-section"]');
          break;
        case 'alerta':
        case 'cambio':
          navButton = document.querySelector('.nav-item[data-section="alertas-section"]');
          break;
      }
      if (navButton) navButton.click();
      // Si es impresora, abrir modal
      if (action === 'impresora') abrirModalImpresora();
      console.log('Acción:', action);
      fabOptions.classList.add('hidden');
    });
  });

  // Hover sidebar
  sidebar.addEventListener('mouseenter', () => sidebar.classList.add('expanded'));
  sidebar.addEventListener('mouseleave', () => sidebar.classList.remove('expanded'));

  // Logout
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = '../public/close-session.php';
    });
  });

  // — Se fuerza el inicializar en impresoras —
  navItems[0].click();
});