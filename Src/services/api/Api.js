import AsyncStorage from "@react-native-async-storage/async-storage";

const URL_BASE = "http://10.20.201.227:8000/api";
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
            console.log(`Token: ${token}`);
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API] url completa para la request: ${url}`);

        try {
            const response = await fetch(url, config)
            let data;

            try {
                data = await response.json();
            } catch {
                data = { message: "[API] Error al procesar la respuesta"};
            }

            if (!response.ok) {
                if (response.status === 401) {
                    await this.removeToken();
                    const error = new Error('[API] Sesión expirada, inicie nuevamente');
                    error.status = response.status;
                    error.sessionExpired = true;
                    throw error;
                }

                const error = new Error(data.message || '[API] Error desconocido');
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

    // Endpoints
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
    async getCurrentUser() {
        return await this.request('/user', { method: 'GET' });
    }


    async logout() {
        await this.removeToken();
        await AsyncStorage.removeItem(USER_KEY);
        return true;
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
}


export default new ApiService();
