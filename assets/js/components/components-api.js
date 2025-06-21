// assets/js/printers/components-api.js

export async function fetchComponentes() {
  const res = await fetch('get_cards/get_componentes.php');
  return await res.json();
}