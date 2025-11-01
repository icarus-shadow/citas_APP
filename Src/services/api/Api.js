import AsyncStorage from "@react-native-async-storage/async-storage";

const URL_BASE = "https://18a61b7e8b61.ngrok-free.app/api";
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

class ApiService {
    constructor() {
        this.urlBase = URL_BASE;
    }

    async request(endpoint, options = {}) {
        const url = `${this.urlBase}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            ...options,
        };

        // Añadir token si existe
        const token = await this.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.log(`[API] No hay token disponible`);
        }
        console.log(`[API] Request: ${options.method || 'GET'} ${url}`);

        try {
            const response = await fetch(url, config)
            let data;

            try {
                data = await response.json();
            } catch {
                data = { message: "[API] Error al procesar la respuesta"};r
            }

            if (!response.ok) {
                console.log(`[API] Response not ok - Status: ${response.status}, Data:`, data);

                if (response.status === 401) {
                    await this.removeToken();
                    const error = new Error('[API] Sesión expirada, inicie nuevamente');
                    error.status = response.status;
                    error.sessionExpired = true;
                    throw error;
                }

                const error = new Error(data.message || data.error || '[API] Error desconocido');
                error.status = response.status;
                throw error;
            }

            if (response.status != 200 && data.success === false) {
                const error = new Error(data.message || '[API] Error desconocido');
                error.status = response.status;
                throw error;
            }
            return data;
        } catch (error) {
            if (!error.status) {
                error.message = '[API] Error de conexión. Verifica tu internet.';
            }
            throw error;
        }
    }

    // manejo de tokens
    async getToken() {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch {
            return null;
        }
    }
    async setToken(token) {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error(`[API] Error al guardar token: ${error}`);
        }
    }
    async removeToken() {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
            await AsyncStorage.removeItem(USER_KEY);
        } catch (error) {
            console.error(`[API] Error al eliminar token: ${error}`);
        }
    }

    // Endpoints Autenticacion
    async login(data) {
        const response = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.access_token) {
            await this.setToken(response.access_token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
        }
        return { token: response.access_token, user: response.user };
    }
    async register(data) {
        console.log(`[API | register] DATA: ${JSON.stringify(data)}`);
        const response = await this.request('/registrar-paciente', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response;
    }

    // Email verification methods
    async sendVerificationCode(email) {
        const response = await this.request('/send-verification-code', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        return response;
    }

    async verifyCode(email, code) {
        const response = await this.request('/verify-code', {
            method: 'POST',
            body: JSON.stringify({ email, code }),
        });
        return response;
    }
    async getCurrentUser() {
        return await this.request('/user', { method: 'GET' });
    }
    async getUserById(id) {
        return await this.request(`/users/${id}`, { method: 'GET' });
    }
    async logout() {
        await this.removeToken();
        await AsyncStorage.removeItem(USER_KEY);
        return true;
    }

    // manejo perfil
    async changePassword(data) {
        try {
            const response = await this.request('/change-password', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            console.log('[API] Respuesta del servidor al cambiar contraseña:', response);
            return {success: true, message: 'Contraseña actualizada exitosamente', data: response};
        } catch (error) {
            const errorMessage = error.message || 'Error al cambiar la contraseña';
            if (error.status === 422) {
                throw new Error('La contraseña no cumple con los requisitos mínimos');
            } else if (error.status === 409) {
                throw new Error('La contraseña actual es incorrecta');
            }
            throw new Error(errorMessage);
        }
    }
    async deleteAccount(data) {
        try {
            const response = await this.request('/delete-account', {
                method: 'DELETE',
                body: JSON.stringify(data),
            });

            console.log('[API] Respuesta del servidor al eliminar cuenta:', response);
            return {success: true, message: 'Cuenta eliminada exitosamente', data: response};
        } catch (error) {
            const errorMessage = error.message || 'Error al eliminar la cuenta';
        }
    }

    async getPaciente() {
        return await this.request('/mi-perfil', { method: 'GET' });
    }
    async getDoctor() {
        return await this.request('/mi-perfil-doctor', { method: 'GET' });
    }
    async getAdmin() {
        return await this.request('/mi-perfil-admin', { method: 'GET' });
    }


    // Métodos para pacientes
    async updatePaciente(data) {
        return await this.request('/mi-perfil', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getDoctores() {
        return await this.request('/doctores', { method: 'GET' });
    }

    async getEspecialidades() {
        return await this.request('/especialidades', { method: 'GET' });
    }

    async getEspecialidad(id) {
        return await this.request(`/especialidades/${id}`, { method: 'GET' });
    }

    async getMisCitas() {
        return await this.request('/citas/mis-citas', { method: 'GET' });
    }

    async createCita(data) {
        return await this.request('/citas', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateCita(id, data) {
        return await this.request(`/citas/paciente/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteCita(id) {
        return await this.request(`/citas/${id}`, {
            method: 'DELETE',
        });
    }

    async deleteCitaPaciente(id) {
        return await this.request(`/citas/paciente/${id}`, {
            method: 'DELETE',
        });
    }

    async getDoctoresPorEspecialidad(id) {
        return await this.request(`/doctores/especialidad/${id}`, { method: 'GET' });
    }

    async getDisponibilidadDoctor(id) {
        return await this.request(`/doctor/${id}/disponibilidad`, { method: 'GET' });
    }

    async getHorariosByDoctor(id_doctor) {
        return await this.request(`/horarios/listByDoctor/${id_doctor}`, { method: 'GET' });
    }

    async getCitasByDoctor(id_doctor) {
        return await this.request(`/citas/doctor/${id_doctor}`, { method: 'GET' });
    }

    // Nuevos métodos para slots de citas
    async getAvailableSlots(doctorId, startDate, endDate) {
        const params = new URLSearchParams({
            startDate: startDate,
            endDate: endDate
        });
        return await this.request(`/doctores/${doctorId}/slots?${params}`, { method: 'GET' });
    }

    async validateSlot(doctorId, fecha, hora) {
        return await this.request(`/doctores/${doctorId}/validate-slot`, {
            method: 'POST',
            body: JSON.stringify({ fecha, hora }),
        });
    }

    async getAssignedSchedules(doctorId) {
        return await this.request(`/doctores/${doctorId}/schedules`, { method: 'GET' });
    }

    async getSlotsByDate(doctorId, date) {
        return await this.request(`/doctores/${doctorId}/slots-by-date?date=${date}`, { method: 'GET' });
    }


    // Métodos para doctores
    async getCitasDoctor() {
        return await this.request('/doctor/mis-citas', { method: 'GET' });
    }

    async getPacientes() {
        return await this.request('/pacientes', { method: 'GET' });
    }

    // Métodos para doctores - horarios y notificaciones
    async getMisHorarios() {
        return await this.request('/mis-horarios', { method: 'GET' });
    }

    async createNotificacion(data) {
        return await this.request('/notificaciones', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getMisNotificaciones() {
        return await this.request('/mis-notificaciones', { method: 'GET' });
    }

    async getSupportAdmins() {
        return await this.request('/support-admins', { method: 'GET' });
    }

    // Méodo de diagnóstico para verificar autenticación
    async registerDeviceToken(token, deviceType = 'mobile') {
        return await this.request('/register-device-token', {
            method: 'POST',
            body: JSON.stringify({ token, device_type: deviceType }),
        });
    }

    async checkAuthStatus() {
        try {
            const token = await this.getToken();
            console.log('[API] Check Auth Status - Token exists:', !!token);

            if (!token) {
                return { authenticated: false, message: 'No token found' };
            }

            // Intentar acceder a un endpoint protegido
            const userResponse = await this.getCurrentUser();
            console.log('[API] Current user:', userResponse);

            return {
                authenticated: true,
                user: userResponse,
                token: token.substring(0, 20) + '...'
            };
        } catch (error) {
            console.log('[API] Auth check failed:', error.message);
            return {
                authenticated: false,
                error: error.message,
                status: error.status
            };
        }
    }
}


export default new ApiService();
