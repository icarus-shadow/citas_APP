import ApiService from "../api/Api";

class CitasDoctor {
    async getCitas() {
        console.log('[CitasDoctor] getCitas() - Iniciando petición a /doctorCitas');
        const result = await ApiService.request('/doctorCitas', { method: 'GET' });
        console.log('[CitasDoctor] getCitas() - Respuesta:', result);
        console.log('[CitasDoctor] getCitas() - Tipo de respuesta:', typeof result, 'Es array?', Array.isArray(result));
        if (Array.isArray(result)) {
            console.log('[CitasDoctor] getCitas() - Longitud del array:', result.length);
            if (result.length > 0) {
                console.log('[CitasDoctor] getCitas() - Primera cita:', result[0]);
            }
        }
        return result;
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