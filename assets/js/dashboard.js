// assets/js/dashboard.js

document.addEventListener('DOMContentLoaded', function() {
  // --- VARIABLES PRINCIPALES ---
  const navItems     = document.querySelectorAll('.nav-item[data-section]');
  const sections     = document.querySelectorAll('.dashboard-section');
  const sidebar      = document.querySelector('.sidebar');
  const mainContent  = document.querySelector('.main-content');
  const printerCards = document.querySelectorAll('.impresora-card');
  const filterButtons= document.querySelectorAll('.filter-button');
  const searchBar    = document.getElementById('searchBar');
  const logoutBtn    = document.getElementById('logout-btn');

  // --- FUNCIONES AUXILIARES ---
  function cargarComponentes() {
    fetch('get_componentes.php')
      .then(res => res.json())
      .then(data => {
        const cont = document.getElementById("componentes-section");
        cont.innerHTML = ""; // limpiamos

        if (!data.length) {
          cont.innerHTML = "<p>No hay componentes registrados.</p>";
          return;
        }
        // Creamos tarjetas
        data.forEach(c => {
          const card = document.createElement("div");
          card.className = "card componente-card";
          card.innerHTML = `
            <div class="card-info">
              <h3>${c.nombre}</h3>
              <p><strong>Serie:</strong> ${c.num_serie}</p>
              <p><strong>Marca:</strong> ${c.marca}</p>
              <p><strong>Ubicación:</strong> ${c.ubicacion_id}</p>
              <p><strong>Estado:</strong> ${c.estado}</p>
              <p><strong>Stock:</strong> ${c.cantidad_stock}</p>
              <button class="expand-button">Ver más</button>
            </div>
          `;
          cont.appendChild(card);
        });
      })
      .catch(err => console.error("Error al cargar componentes:", err));
  }

  // --- NAV SIDEBAR: Mostrar sección correspondiente ---
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Active visual
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Mostrar solo la sección correspondiente
      const target = item.getAttribute('data-section');
      sections.forEach(sec => {
        if (sec.id === target) sec.classList.add('active');
        else sec.classList.remove('active');
      });

      // Si es la pestaña de componentes, cargar datos
      if (target === 'componentes-section') {
        cargarComponentes();
      }
    });
  });

  // Al entrar con el ratón
  sidebar.addEventListener('mouseenter', () => {
    sidebar.classList.add('expanded');
  });
  // Al salir
  sidebar.addEventListener('mouseleave', () => {
    sidebar.classList.remove('expanded');
  });

  // --- FILTRADO DE IMPRESORAS ---
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      printerCards.forEach(card => {
        const estado = card.dataset.estado;
        if ((filter === 'operativas'    && estado === 'FUNCIONANDO') ||
            (filter === 'no-operativas' && estado !== 'FUNCIONANDO')) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- BÚSQUEDA EN IMPRESORAS ---
  searchBar.addEventListener('input', () => {
    const term = searchBar.value.toLowerCase();
    printerCards.forEach(card => {
      const name  = card.querySelector('h3').textContent.toLowerCase();
      const serie = card.querySelector('p strong').nextSibling.textContent.toLowerCase();
      card.style.display = (name.includes(term) || serie.includes(term)) 
                            ? 'flex' 
                            : 'none';
    });
  });

  // --- CERRAR SESIÓN ---
  logoutBtn.addEventListener('click', () => {
    // Opcional: agregar headers no-cache en PHP para deshabilitar back-button
    window.location.href = '../public/close-session.php';
  });

});