import ApiService from "../../api/Api"


class Counters {
    async countCitas(){
        return await ApiService.request('/countCitas', { method: 'GET' });
    }

    async countPacientes() {
        return await  ApiService.request('/countPacientes', { method: 'GET' });
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
        return await ApiService.request(`/doctor/${doctorId}/count-citas-asignadas`, { method: 'GET' });
    }

    async countCitasProximas(doctorId) {
        return await ApiService.request(`/doctor/${doctorId}/count-citas-proximas`, { method: 'GET' });
    }

    async countPacientesAtendidos(doctorId) {
        return await ApiService.request(`/doctor/${doctorId}/count-pacientes-atendidos`, { method: 'GET' });
    }

}

export default new Counters()