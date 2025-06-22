// assets/js/departaments-api.js

export async function fetchDepartamentos() {
  const res = await fetch('get_cards/get_ubicaciones.php');
  return await res.json();
}