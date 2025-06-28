// assets/js/alerts/notification-manager.js

const INTERVALOS = {
  ALTA: 1 * 60 * 1000,
  MEDIA: 15 * 60 * 1000,
  BAJA: 30 * 60 * 1000
};

class NotificationManager {
  constructor() {
    this.scheduled = new Map(); // alertaId → { timeoutId, intervalId }
  }

  async init() {
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  schedule(alerta) {
    const { id, prioridad, fecha_reportado, impresora, num_serie, ubicacion, reporte } = alerta;
    if (prioridad === 'FALSA ALARMA') return;
    if (this.scheduled.has(id)) return; 
    const intervalo = INTERVALOS[prioridad];
    const sinceReport = Date.now() - new Date(fecha_reportado).getTime();
    const timeToNext = intervalo - (sinceReport % intervalo);

    const timeoutId = setTimeout(() => {
      this._showAndRepeat(alerta);
    }, timeToNext);

    this.scheduled.set(id, { timeoutId, intervalId: null });
  }

  _showAndRepeat(alerta) {
    this._show(alerta);
    const intervalo = INTERVALOS[alerta.prioridad];
    const intervalId = setInterval(() => this._show(alerta), intervalo);

    const entry = this.scheduled.get(alerta.id);
    entry.intervalId = intervalId;
  }

  _show({ impresora, num_serie, ubicacion, reporte }) {
    if (Notification.permission !== 'granted') return;

    const title = `Incidencia: ${impresora}`;
    const body  = `${num_serie}${ubicacion ? ' – '+ubicacion : ''}\n${reporte.slice(0,80)}…`;
    new Notification(title, { body });
  }

  cancel(id) {
    const entry = this.scheduled.get(id);
    if (!entry) return;
    clearTimeout(entry.timeoutId);
    clearInterval(entry.intervalId);
    this.scheduled.delete(id);
  }
}

export const notificationManager = new NotificationManager();