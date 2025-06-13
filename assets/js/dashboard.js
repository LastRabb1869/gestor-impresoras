// assets/js/dashboard.js

document.addEventListener('DOMContentLoaded', function() {
  // Sidebar navigation
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const sections = document.querySelectorAll('.dashboard-section');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active on all nav
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Show related section
      const target = item.getAttribute('data-section');
      sections.forEach(sec => {
        if (sec.id === target) sec.classList.add('active');
        else sec.classList.remove('active');
      });
    });
  });

  // Filter buttons in impresoras section
  const filterButtons = document.querySelectorAll('.filter-button');
  const printerCards = document.querySelectorAll('.impresora-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      printerCards.forEach(card => {
        if (filter === 'operativas' && card.dataset.estado === 'FUNCIONANDO') {
          card.style.display = 'flex';
        } else if (filter === 'no-operativas' && card.dataset.estado !== 'FUNCIONANDO') {
          card.style.display = 'flex';
        } else if (filter === 'operativas' || filter === 'no-operativas') {
          card.style.display = 'none';
        }
      });
    });
  });

  // Search bar functionality
  const searchBar = document.getElementById('searchBar');

  searchBar.addEventListener('input', () => {
    const term = searchBar.value.toLowerCase();
    printerCards.forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      const serie = card.querySelector('p strong').nextSibling.textContent.toLowerCase();
      if (name.includes(term) || serie.includes(term)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // Profile dropdown
  const avatar = document.getElementById('profile-avatar');
  const dropdown = document.getElementById('profile-dropdown');

  avatar.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Close dropdown if click outside
  document.addEventListener('click', (e) => {
    if (!avatar.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });

  // Toggle sidebar on small screens
  sidebar.addEventListener('click', (e) => {
    // Si clicaste en un icono sin etiqueta (span oculto), toggle
    if (e.target.closest('.nav-item')) {
    sidebar.classList.toggle('collapsed');
    // Ajustamos la clase de main-content
    mainContent.classList.toggle('expanded');
    }
  });

  function cargarComponentes() {
  fetch('get_componentes.php')
    .then(res => res.json())
    .then(data => {
      const contenedor = document.getElementById("seccionComponentes");
      contenedor.innerHTML = "";

      if (data.length === 0) {
        contenedor.innerHTML = "<p>No hay componentes registrados.</p>";
        return;
      }

      data.forEach(componente => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <h3>${componente.nombre}</h3>
          <p><strong>Serie:</strong> ${componente.numero_serie}</p>
          <p><strong>Marca:</strong> ${componente.marca}</p>
          <p><strong>Ubicación:</strong> ${componente.ubicacion}</p>
          <p><strong>Estado:</strong> ${componente.estado}</p>
          <p><strong>Stock:</strong> ${componente.cantidad_stock}</p>
          <button class="expand-button">Ver más</button>
        `;

        contenedor.appendChild(card);
      });
    })
    .catch(error => console.error("Error cargando componentes:", error));
  }

  // Asociar el evento al botón de Componentes
  document.addEventListener("DOMContentLoaded", () => {
    const btnComponentes = document.getElementById("btnComponentes");
    if (btnComponentes) {
      btnComponentes.addEventListener("click", () => {
        document.getElementById("seccionImpresoras").style.display = "none";
        document.getElementById("seccionComponentes").style.display = "flex";
        cargarComponentes();
      });
    }
  });

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    window.location.href = '../public/close-session.php';
  });
});