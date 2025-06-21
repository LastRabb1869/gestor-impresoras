// assets/js/printers/cambios-api.js

export async function fetchCambios() {
  const res = await fetch('get_cards/get_cambios.php');
  return await res.json();
}