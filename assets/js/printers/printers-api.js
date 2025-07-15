// assets/js/printers/printers-api.js

export async function fetchImpresoras() {
  const res = await fetch('get_cards/get_impresoras.php');
  return await res.json();
}

export async function setImpresora(formData) {
  const res = await fetch('set_info/set_impresoras.php', { method: 'POST', body: formData });
  return await res.text();
}