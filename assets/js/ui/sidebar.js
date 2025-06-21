// assets/js/ui/sidebar.js

export function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  // Hover desktop
  sidebar.addEventListener('mouseenter', () => sidebar.classList.add('expanded'));
  sidebar.addEventListener('mouseleave', () => sidebar.classList.remove('expanded'));

  // Logout en escritorio
  document.querySelectorAll('.logout-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      window.location.href = '../public/close-session.php';
    })
  );
}