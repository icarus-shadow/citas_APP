import ApiService from "../api/Api";

class CountersAdmin {
    async countCitas() {
        return await ApiService.request('/countCitas', { method: 'GET' });
    }

    async countPacientes() {
        return await ApiService.request('/countPacientes', { method: 'GET' });
    }

    async countDoctores() {
        return await ApiService.request('/countDoctores', { method: 'GET' });
    }

    async countAdministradores() {
        return await ApiService.request('/countAdministradores', { method: 'GET' });
    }

    async countEspecialidades() {
        return await ApiService.request('/countEspecialidades', { method: 'GET' });
    }

    async countHorarios() {
        return await ApiService.request('/countHorarios', { method: 'GET' });
    }

    // Métodos para contadores de doctores
    async countCitasAsignadas(doctorId) {
        return await ApiService.request(`/doctor/${doctorId}/countCitasAsignadas`, { method: 'GET' });
    }

    async countCitasProximas(doctorId) {
        return await ApiService.request(`/doctor/${doctorId}/countCitasProximas`, { method: 'GET' });
    }

    async countPacientesAtendidos(doctorId) {
        return await ApiService.request(`/doctor/${doctorId}/countPacientesAtendidos`, { method: 'GET' });
    }
}

export default new CountersAdmin();