import ApiService from "../api/Api";

class NotificacionesAdmin {
    async getContadores() {
        return await ApiService.request('/notificaciones/contadores', { method: 'GET' });
    }

    async getActivas() {
        return await ApiService.request('/notificaciones/activas', { method: 'GET' });
    }

    async getHistorial() {
        return await ApiService.request('/notificaciones/historial', { method: 'GET' });
    }

    async aprobarNotificacion(id) {
        return await ApiService.request(`/notificaciones/${id}/aprobar`, { method: 'POST' });
    }

    async rechazarNotificacion(id) {
        return await ApiService.request(`/notificaciones/${id}/rechazar`, { method: 'POST' });
    }

    async deleteHistorial() {
        return await ApiService.request('/notificaciones/historial', { method: 'DELETE' });
    }
}

export default new NotificacionesAdmin();