import ApiService from "../api/Api";

class CitasDoctor {
    async getCitas() {
        return await ApiService.request('/doctorCitas', { method: 'GET' });
    }

    async createCita(data) {
        return await ApiService.request('/doctorCitas', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateCita(id, data) {
        return await ApiService.request(`/doctorCitas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteCita(id) {
        return await ApiService.request(`/doctorCitas/${id}`, {
            method: 'DELETE',
        });
    }
}

export default new CitasDoctor();