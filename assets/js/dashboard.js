document.addEventListener('DOMContentLoaded', () => {
  // — Elementos principales —
  const navItems            = document.querySelectorAll('.nav-item[data-section]');
  const sections            = document.querySelectorAll('.dashboard-section');
  const sidebar             = document.querySelector('.sidebar');
  const logoutBtn           = document.getElementById('logout-btn');
  const impresorasSection   = document.getElementById('impresoras-section');
  const componentesSection  = document.getElementById('componentes-section');
  const searchBar           = document.getElementById('searchBar');

  // — Aplica filtro sobre impresoras —
  function applyPrinterFilter(filter) {
    document.querySelectorAll('#impresoras-section .impresora-card')
      .forEach(card => {
        const estado = card.dataset.estado;
        const ok = filter === 'todas'
                || (filter === 'operativas'    && estado === 'FUNCIONANDO')
                || (filter === 'no-operativas' && estado !== 'FUNCIONANDO');
        card.style.display = ok ? 'flex' : 'none';
      });
  }

  // — Aplica filtro sobre componentes —
  function applyComponentFilter(filter) {
    document.querySelectorAll('#componentes-section .componente-card')
      .forEach(card => {
        const estado = card.dataset.estado;
        const ok = filter === 'todos'
                || (filter === 'en-condiciones'  && estado === 'EXCELENTES CONDICIONES')
                || (filter === 'posible-fallo'   && estado === 'POSIBLE FALLO')
                || (filter === 'baja-definitiva' && estado === 'BAJA DEFINITIVA')
                || (filter === 'desconocido'     && estado === 'DESCONOCIDO')
                || (filter === 'sin-stock'       && estado === 'SIN STOCK');
        card.style.display = ok ? 'flex' : 'none';
      });
  }

  // — Carga dinámicamente los componentes —
  function cargarComponentes() {
    fetch('get_cards/get_componentes.php')
      .then(res => res.json())
      .then(data => {
        const cont = componentesSection.querySelector('.cards-container');
        cont.innerHTML = '';
        if (!data.length) {
          cont.innerHTML = '<p>No hay componentes registrados.</p>';
          return;
        }
        data.forEach(c => {
          const card = document.createElement('div');
          card.className = 'card componente-card';
          card.setAttribute('data-estado', c.estado);
          card.innerHTML = `
            <div class="card-img">
              <img src="../assets/img/${c.imagen || 'default-componente.jpg'}" alt="${c.nombre}">
            </div>
            <div class="card-info">
              <h3>${c.nombre}</h3>
              <p><strong>Serie:</strong> ${c.num_serie}</p>
              <p><strong>Marca:</strong> ${c.marca}</p>
              <p><strong>Ubicación:</strong> ${c.ubicacion_id}</p>
              <p><strong>Estado:</strong> ${c.estado}</p>
              <p><strong>Stock:</strong> ${c.cantidad_stock}</p>
              <button class="expand-button">Ver más</button>
            </div>`;
          cont.appendChild(card);
        });
      })
      .catch(err => console.error('Hubo un error al cargar componentes: ', err));
  }

  // — Delegación de clics en Impresoras —
  impresorasSection.addEventListener('click', e => {
    // filtro
    const btnI = e.target.closest('.filter-button');
    if (btnI) {
      impresorasSection.querySelectorAll('.filter-button')
        .forEach(b => b.classList.remove('active'));
      btnI.classList.add('active');
      applyPrinterFilter(btnI.dataset.filter);
      return;
    }
    // "Ver más"
    const expI = e.target.closest('.expand-button');
    if (expI) {
      console.log('Ver más impresora ID:', expI.dataset.id);
    }
  });

  // — Delegación de clics en Componentes —
  componentesSection.addEventListener('click', e => {
    // filtro
    const btnC = e.target.closest('.filter-button-comp');
    if (btnC) {
      componentesSection.querySelectorAll('.filter-button-comp')
        .forEach(b => b.classList.remove('active'));
      btnC.classList.add('active');
      applyComponentFilter(btnC.dataset.filter);
      return;
    }
    // "Ver más"
    const expC = e.target.closest('.expand-button');
    if (expC) {
      console.log('Ver más componente');
    }
  });

  // — Búsqueda en Impresoras —
  searchBar.addEventListener('input', () => {
    const term = searchBar.value.toLowerCase();
    document.querySelectorAll('#impresoras-section .impresora-card')
      .forEach(card => {
        const nombre = card.querySelector('h3').textContent.toLowerCase();
        const serie  = card.querySelector('p strong').nextSibling.textContent.toLowerCase();
        card.style.display = (nombre.includes(term) || serie.includes(term)) ? 'flex' : 'none';
      });
  });

  // — Navegación entre secciones —
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const target = item.dataset.section;
      sections.forEach(s =>
        s.id === target ? s.classList.add('active') : s.classList.remove('active')
      );

      if (target === 'impresoras-section') {
        // reset filtros Impresoras
        const btnAllI = impresorasSection.querySelector('.filter-button[data-filter="todas"]');
        impresorasSection.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
        btnAllI.classList.add('active');
        applyPrinterFilter('todas');
      }
      if (target === 'componentes-section') {
        // carga + reset filtros Componentes
        cargarComponentes();
        const btnAllC = componentesSection.querySelector('.filter-button-comp[data-filter="todos"]');
        componentesSection.querySelectorAll('.filter-button-comp').forEach(b => b.classList.remove('active'));
        btnAllC.classList.add('active');
        applyComponentFilter('todos');
      }
    });
  });

  // — Hover sidebar —
  sidebar.addEventListener('mouseenter', () => sidebar.classList.add('expanded'));
  sidebar.addEventListener('mouseleave', () => sidebar.classList.remove('expanded'));

  // — Logout —
  logoutBtn.addEventListener('click', () => {
    window.location.href = '../public/close-session.php';
  });

  // — Inicializar en Impresoras —
  navItems[0].click();
});