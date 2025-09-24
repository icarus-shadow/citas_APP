const URL_BASE = "http://127.0.0.1:8000/api";

class ApiService {
    constructor() {
        this.urlBase = URL_BASE;
    }

    async request(endpoint, options = {}) {
        const url = `${this.urlBase}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json', ...options.headers,
            }, ...options,
        };

        // añadir autenticación si el token esta disponible
        const token = await this.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`
            Request: ${endpoint}
            token: ${token}
            `);
        } else {
            console.log(`
            Request: ${endpoint}
            token: no disponible
            `);
        }

        try {
            const response = await fetch(url, config);
            let data;

            try {
                data = await response.json();
            } catch (parseError) {
                data = {message: 'Error del servidor'};
            }
            if(!response.ok){
                if(response.status === 401){
                    console.log(`error 401 en el endpoint: ${endpoint}`);
                    console.log(`Response data: ${data}`);
                    await this.removeToken();
                    const error = new Error('Sesion expirada, inicie nuevamente');
                    error.status = response.status;
                    error.endpoint = endpoint;
                    error.sessionExpired = true;
                    throw error;
                }

                // crea errores especificos basados en el codigo de estatus
                let errorMessage = data.message || 'Error desconocido';

                if (response.status === 403) {
                    errorMessage = data.message || 'No tienes permisos para esta acción';
                } else if (response.status === 404) {
                    errorMessage = data.message || 'Recurso no encontrado';
                } else if (response.status === 422) {
                    errorMessage = data.message || 'Datos inválidos';
                } else if (response.status === 500) {
                    errorMessage = 'Error interno del servidor';
                } else if (response.status >= 400 && response.status < 500) {
                    errorMessage = data.message || 'Error de solicitud';
                } else if (response.status >= 500) {
                    errorMessage = 'Error del servidor';
                }

                const error = new Error(errorMessage);
                error.status = response.status;
                error.endpoint = endpoint;
                throw error;
            }
            return data;
        } catch (error) {
            console.log(`fallo la request a la API, detalles: ${error}`);

            // si el error es de conexion
            if(!error.status){
                error.message = 'Error de conexion. Verifica tu conexion a internet';
            }
            throw error;
        }
    }

}

