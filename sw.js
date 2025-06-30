// service-worker.js
self.addEventListener('install', event => self.skipWaiting());

self.addEventListener('activate', event => {
  console.log('[SW] Activo');
  // ⬅️ controla todas las pestañas sin recargar
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body } = event.data.payload;
    self.registration.showNotification(title, { body });
  }
});
