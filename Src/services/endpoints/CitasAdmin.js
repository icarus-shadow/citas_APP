import ApiService from "../api/Api";

class CitasAdmin {
    async getCitas() {
        return await ApiService.request('/admin/citas', { method: 'GET' });
    }

    async getCita(id) {
        return await ApiService.request(`/admin/citas/${id}`, { method: 'GET' });
    }

    async updateCita(id, data) {
        return await ApiService.request(`/admin/citas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteCita(id) {
        return await ApiService.request(`/admin/citas/${id}`, {
            method: 'DELETE',
        });
    }

    async createCita(data) {
        return await ApiService.request('/admin/citas', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export default new CitasAdmin();