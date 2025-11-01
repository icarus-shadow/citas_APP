import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import ApiService from '../../Src/services/api/Api';

const validateRegistration = (data) => {
    const required = ['email', 'password', 'nombres', 'apellidos', 'documento', 'rh', 'fecha_nacimiento', 'genero', 'edad'];
    const errors = [];

    required.forEach(field => {
        if (!data[field]) errors.push(`${field} es requerido`);
    });

    if (data.password && data.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Email inválido');
    }

    if (data.genero && !['M', 'F'].includes(data.genero)) {
        errors.push('Género debe ser M o F');
    }

    return errors;
};

// Helper para evitar que la llamada se quede colgada
const withTimeout = (promise, ms = 8000) =>
    Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
    ]);

// 🔹 Verificar estado de autenticación
export const checkAuthState = createAsyncThunk(
    '/checkAuthState',
    async (_, { rejectWithValue }) => {
        try {
            const storedToken = await AsyncStorage.getItem('auth_token');
            const storedUser = await AsyncStorage.getItem('user_data');
            console.log('[AuthSlice] checkAuthState start — token:', !!storedToken, 'userData:', !!storedUser);

            if (storedToken && storedUser) {
                try {
                    if (ApiService && typeof ApiService.getCurrentUser === 'function') {
                        await withTimeout(ApiService.getCurrentUser(), 8000);
                    }
                } catch (err) {
                    console.warn('[AuthSlice] getCurrentUser failed:', err.message);
                    await AsyncStorage.removeItem('auth_token');
                    await AsyncStorage.removeItem('user_data');
                    return rejectWithValue('Token inválido o expirado');
                }

                return { token: storedToken, user: JSON.parse(storedUser) };
            }

            console.log('[AuthSlice] No hay token en storage');
            return { token: null, user: null };
        } catch (error) {
            console.error('[AuthSlice] checkAuthState error:', error);
            return rejectWithValue(error.message || 'Error desconocido');
        }
    }
);

// 🔹 Login de usuario
export const login = createAsyncThunk(
    '/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await ApiService.login({ email, password });
            console.log('[AuthSlice] login response:', response);

            const user = response.user || response.data?.user;
            const token = response.token || response.data?.token;

            if (!user || !token) return rejectWithValue('Respuesta inválida del servidor');

            await AsyncStorage.setItem('auth_token', token);
            await AsyncStorage.setItem('user_data', JSON.stringify(user));

            // Registrar token de dispositivo para notificaciones push
            try {
                const pushToken = await AsyncStorage.getItem('push_token');
                console.log('[AuthSlice] Push token from storage:', pushToken);
                if (pushToken) {
                    console.log('[AuthSlice] Intentando registrar token en backend...');
                    const deviceType = Platform.OS === 'ios' ? 'ios' : 'android';
                    const response = await ApiService.registerDeviceToken(pushToken, deviceType);
                    console.log('[AuthSlice] Push token registrado en backend:', response);
                } else {
                    console.log('[AuthSlice] No push token found in storage');
                }
            } catch (error) {
                console.error('[AuthSlice] Error registrando push token:', error);
            }

            return { user, token };
        } catch (error) {
            console.error('[AuthSlice] login error:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error de login');
        }
    }
);

export const register = createAsyncThunk(
    '/register',
    async (userData, {rejectWithValue}) => {
        try {
            const validationErrors = validateRegistration(userData);
            if (validationErrors.length > 0) {
                return rejectWithValue(validationErrors.join(', '));
            }

            const response = await ApiService.register(userData);
            console.log('[AuthSlice] register response:', response);

            const user = response.user || response.data?.user;
            const token = response.token || response.data?.token;

            if (!user || !token) return rejectWithValue('Respuesta inválida del servidor');

            await AsyncStorage.setItem('auth_token', token);
            await AsyncStorage.setItem('user_data', JSON.stringify(user));

            return {user, token};
        } catch (error) {
            console.error('[AuthSlice] register error:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error de registro');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // checkAuthState
            .addCase(checkAuthState.pending, (state) => {
                state.isLoading = true;
                console.log('[AuthSlice] checkAuthState pending');
            })
            .addCase(checkAuthState.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload?.user || null;
                state.token = action.payload?.token || null;
                state.error = null;
                console.log('[AuthSlice] checkAuthState fulfilled — token:', !!state.token, 'user:', !!state.user);
            })
            .addCase(checkAuthState.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.error = action.payload || action.error?.message;
                console.log('[AuthSlice] checkAuthState rejected:', state.error);
            })

            // login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                console.log('[AuthSlice] login pending');
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload?.user || null;
                state.token = action.payload?.token || null;
                state.error = null;
                console.log('[AuthSlice] login fulfilled — user:', !!state.user, 'token:', !!state.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message;
                console.log('[AuthSlice] login rejected:', state.error);
            })

            // register
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                console.log('[AuthSlice] register pending');
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload?.user || null;
                state.token = action.payload?.token || null;
                state.error = null;
                console.log('[AuthSlice] register fulfilled — user:', !!state.user, 'token:', !!state.token);
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message;
                console.log('[AuthSlice] register rejected:', state.error);
            });
    },
});

export default authSlice.reducer;
