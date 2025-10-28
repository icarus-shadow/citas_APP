import ApiService from "../api/Api";

class DoctoresAdmin {
    async registrarDoctor(data) {
        return await ApiService.request('/registrar-doctor', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getDoctores() {
        return await ApiService.request('/doctores', { method: 'GET' });
    }

    async getDoctor(id) {
        return await ApiService.request(`/doctores/${id}`, { method: 'GET' });
    }

    async updateDoctor(id, data) {
        return await ApiService.request(`/doctores/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteDoctor(id) {
        return await ApiService.request(`/doctores/${id}`, {
            method: 'DELETE',
        });
    }

    async getDoctoresPorEspecialidad(especialidadId) {
        return await ApiService.request(`/doctores/especialidad/${especialidadId}`, { method: 'GET' });
    }

    async getPacientesDoctor(doctorId) {
        return await ApiService.request(`/doctor/${doctorId}/pacientes`, { method: 'GET' });
    }

    async getCitasDoctor(doctorId) {
        return await ApiService.request(`/doctor/${doctorId}/citas`, { method: 'GET' });
    }
}

export default new DoctoresAdmin();