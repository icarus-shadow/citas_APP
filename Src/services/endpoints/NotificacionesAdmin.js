import ApiService from "../api/Api";

class NotificacionesAdmin {
    async getContadores(doctorId = null) {
        const url = doctorId ? `/notificaciones/contadores?doctor_id=${doctorId}` : '/notificaciones/contadores';
        return await ApiService.request(url, { method: 'GET' });
    }

    async getActivas(doctorId = null) {
        const url = doctorId ? `/notificaciones/activas?doctor_id=${doctorId}` : '/notificaciones/activas';
        return await ApiService.request(url, { method: 'GET' });
    }

    async getHistorial(doctorId = null) {
        const url = doctorId ? `/notificaciones/historial?doctor_id=${doctorId}` : '/notificaciones/historial';
        return await ApiService.request(url, { method: 'GET' });
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