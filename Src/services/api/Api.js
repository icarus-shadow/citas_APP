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
                ...options.headers,
            },
            ...options,
        };

        // Añadir token si existe
        const token = await this.getToken();
        if (token) {
            console.log(`Token: ${token}`);
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`url completa para la request: ${url} `);

        try {
            const response = await fetch(url, config);
            let data;

            try {
                data = await response.json();
            } catch {
                data = { message: 'Error del servidor' };
            }

            if (!response.ok) {
                if (response.status === 401) {
                    await this.removeToken();
                    const error = new Error('Sesión expirada, inicie nuevamente');
                    error.status = response.status;
                    error.sessionExpired = true;
                    throw error;
                }

                const error = new Error(data.message || 'Error desconocido');
                error.status = response.status;
                throw error;
            }

            return data;
        } catch (error) {
            if (!error.status) {
                error.message = 'Error de conexión. Verifica tu internet.';
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
            console.error(`Error al guardar token: ${error}`);
        }
    }

    async removeToken() {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
            await AsyncStorage.removeItem(USER_KEY);
        } catch (error) {
            console.error(`Error al eliminar token: ${error}`);
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

    async getCurrentUser() {
        return await this.request('/mi-perfil', { method: 'GET' });
    }
}

export default new ApiService();
