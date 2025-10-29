import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../../Src/services/api/Api';

export const fetchNotificacionesDoctor = createAsyncThunk(
    'notificacionesDoctor/fetchNotificacionesDoctor',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const doctorId = state.auth.user?.id;

            if (!doctorId) {
                return rejectWithValue('No se encontró el ID del doctor');
            }

            const notifications = await ApiService.request('/mis-notificaciones', { method: 'GET' });

            const counters = {
                pendientes: notifications.filter(n => n.estado === 'pendiente').length,
                aprobadas: notifications.filter(n => n.estado === 'aprobada').length,
                rechazadas: notifications.filter(n => n.estado === 'rechazada').length,
            };

            const activeData = notifications.filter(n => n.estado === 'pendiente');
            const historyData = notifications.filter(n => n.estado === 'aprobada' || n.estado === 'rechazada');

            return { counters, activeData, historyData };
        } catch (error) {
            console.error('[NotificacionesDoctorSlice] | (fetchNotificacionesDoctor) \n ERROR:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error al obtener notificaciones del doctor');
        }
    }
);

const notificacionesDoctorSlice = createSlice({
    name: 'notificacionesDoctor',
    initialState: {
        counters: {pendientes: 0, aprobadas: 0, rechazadas: 0},
        activeData: [],
        historyData: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setCountersDoctor: (state, action) => {
            state.counters = action.payload;
        },
        setActiveDataDoctor: (state, action) => {
            state.activeData = action.payload;
        },
        setHistoryDataDoctor: (state, action) => {
            state.historyData = action.payload;
        },
        clearNotificacionesDoctor: (state) => {
            state.counters = {pendientes: 0, aprobadas: 0, rechazadas: 0};
            state.activeData = [];
            state.historyData = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotificacionesDoctor.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNotificacionesDoctor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.counters = action.payload.counters;
                state.activeData = action.payload.activeData;
                state.historyData = action.payload.historyData;
                state.error = null;
            })
            .addCase(fetchNotificacionesDoctor.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message || 'Error desconocido';
            });
    },
});

export const { setCountersDoctor, setActiveDataDoctor, setHistoryDataDoctor, clearNotificacionesDoctor } = notificacionesDoctorSlice.actions;

export const selectNotificacionesDoctorLoading = (state) => state.notificacionesDoctor.isLoading;
export const selectNotificacionesDoctorError = (state) => state.notificacionesDoctor.error;
export const selectNotificacionesDoctorCounters = (state) => state.notificacionesDoctor.counters;
export const selectNotificacionesDoctorActiveData = (state) => state.notificacionesDoctor.activeData;
export const selectNotificacionesDoctorHistoryData = (state) => state.notificacionesDoctor.historyData;

export default notificacionesDoctorSlice.reducer;