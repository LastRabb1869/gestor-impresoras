// assets/js/printers/components-api.js

export async function fetchComponentes() {
  const res = await fetch('get_cards/get_componentes.php');
  return await res.json();
}

export async function setComponente(formData) {
  const res = await fetch('set_info/set_componentes.php', { method: 'POST', body: formData });
  return await res.text();
}