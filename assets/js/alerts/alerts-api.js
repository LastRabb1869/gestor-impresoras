// assets/js/printers/alerts-api.js

export async function fetchAlertas() {
  const res = await fetch('get_cards/get_alertas.php');
  return await res.json();
}