// assets/js/departaments-api.js

export async function fetchDepartamentos() {
  const res = await fetch('get_cards/get_ubicaciones.php');
  return await res.json();
}

// carga ubicaciones
export async function cargarUbicaciones(idSelect = 'select-ubicacion') {
  const selectUbicacion = document.getElementById(idSelect);
  const data = await fetchDepartamentos();
  if (!selectUbicacion) return;
  selectUbicacion.innerHTML = '<option value="">Selecciona ubicación</option>';
  data.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.id;
    opt.textContent = u.nombre;
    selectUbicacion.appendChild(opt);
  });
}