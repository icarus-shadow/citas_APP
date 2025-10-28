import ApiService from "../api/Api";

class HorariosAdmin {
    async asignarHorario(data) {
        return await ApiService.request('/asignar-horario', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async desasignarHorario(data) {
        return await ApiService.request('/desasignar-horario', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async verificarConflictoHorario(data) {
        return await ApiService.request('/verificar-conflicto-horario', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getHorarios() {
        return await ApiService.request('/horarios', { method: 'GET' });
    }

    async createHorario(data) {
        return await ApiService.request('/horarios', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateHorario(id, data) {
        return await ApiService.request(`/horarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteHorario(id) {
        return await ApiService.request(`/horarios/${id}`, {
            method: 'DELETE',
        });
    }
}

export default new HorariosAdmin();