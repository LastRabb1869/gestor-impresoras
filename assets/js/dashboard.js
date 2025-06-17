// assets/js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
  // — Elementos principales —
  const navItems            = document.querySelectorAll('.nav-item[data-section]');
  const sections            = document.querySelectorAll('.dashboard-section');
  const sidebar             = document.querySelector('.sidebar');
  const logoutBtn           = document.getElementById('logout-btn');
  const impresorasSection   = document.getElementById('impresoras-section');
  const componentesSection  = document.getElementById('componentes-section');
  const alertasSection      = document.getElementById('alertas-section');
  const searchBar           = document.getElementById('searchBar');

  // — Carga dinámicamente las impresoras —
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
              <img src="../assets/img/${c.imagen || 'default-impresora.jpg'}" alt="${c.nombre}">
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
        // al entrar en alertas, muestra alertas
        showSection('alertas');
      }
    });
  });

  // === Sección “Alertas y Cambios” ===
  const tabA       = document.querySelector('.filter-tab[data-section="alertas"]');
  const tabC       = document.querySelector('.filter-tab[data-section="cambios"]');
  const contA      = document.getElementById('alertas-container');
  const contC      = document.getElementById('cambios-container');
  const fabToggle  = document.getElementById('fab-toggle');
  const fabOptions = document.querySelector('.fab-options');
  const fabAlert   = document.getElementById('fab-alerta');
  const fabChange  = document.getElementById('fab-cambio');

  function showSection(sec) {
    if (sec === 'alertas') {
      tabA.classList.add('active'); tabC.classList.remove('active');
      contA.style.display = 'flex'; contC.style.display = 'none';
    } else {
      tabC.classList.add('active'); tabA.classList.remove('active');
      contC.style.display = 'flex'; contA.style.display = 'none';
    }
  }

  tabA.addEventListener('click', () => showSection('alertas'));
  tabC.addEventListener('click', () => showSection('cambios'));
  showSection('alertas');

  fabToggle.addEventListener('click', () => fabOptions.classList.toggle('hidden'));
  fabAlert.addEventListener('click', () => { console.log('Crear alerta'); fabOptions.classList.add('hidden'); });
  fabChange.addEventListener('click', () => { console.log('Crear cambio'); fabOptions.classList.add('hidden'); });
  document.addEventListener('click', e => {
    if (!fabToggle.contains(e.target) && !fabOptions.contains(e.target)) {
      fabOptions.classList.add('hidden');
    }
  });

  // Hover sidebar
  sidebar.addEventListener('mouseenter', () => sidebar.classList.add('expanded'));
  sidebar.addEventListener('mouseleave', () => sidebar.classList.remove('expanded'));

  // Logout
  logoutBtn.addEventListener('click', () => window.location.href = '../public/close-session.php');

  // — Se fuerza el inicializar en impresoras —
  navItems[0].click();
});