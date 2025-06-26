// assets/js/alerts/alerts-api.js

export async function fetchAlertas() {
  const res = await fetch('get_cards/get_alertas.php');
  return await res.json();
}

export async function setAlerta(formData) {
  const res = await fetch('set_info/set_alertas.php', {
    method: 'POST',
    body: formData
  });
  return await res.json();  
}

export async function fetchImpresorasDisponibles() {
  const res = await fetch('get_cards/get_impresoras_disponibles.php');
  return await res.json();
}

export async function fetchAlertasDelta(desdeISO) {
  const url = desdeISO
    ? `get_cards/get_alertas_delta.php?desde=${encodeURIComponent(desdeISO)}`
    : 'get_cards/get_alertas_delta.php';
  const res = await fetch(url);
  return res.json();
}