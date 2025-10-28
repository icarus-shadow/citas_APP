import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import NotificacionesAdmin from '../../../Src/services/endpoints/NotificacionesAdmin';

export const fetchNotificaciones = createAsyncThunk(
    'notificaciones/fetchNotificaciones',
    async (_, { rejectWithValue }) => {
        try {
            const [counters, activeData, historyData] = await Promise.all([
                NotificacionesAdmin.getContadores(),
                NotificacionesAdmin.getActivas(),
                NotificacionesAdmin.getHistorial(),
            ]);
            return { counters, activeData, historyData };
        } catch (error) {
            console.error('[NotificacionesSlice] | (fetchNotificaciones) \n ERROR:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error al obtener notificaciones');
        }
    }
);

const notificacionesSlice = createSlice({
    name: 'notificaciones',
    initialState: {
        counters: {pendientes: 0, aprobadas: 0, rechazadas: 0},
        activeData: [],
        historyData: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setCounters: (state, action) => {
            state.counters = action.payload;
        },
        setActiveData: (state, action) => {
            state.activeData = action.payload;
        },
        setHistoryData: (state, action) => {
            state.historyData = action.payload;
        },
        clearNotificaciones: (state) => {
            state.counters = {pendientes: 0, aprobadas: 0, rechazadas: 0};
            state.activeData = [];
            state.historyData = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotificaciones.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNotificaciones.fulfilled, (state, action) => {
                state.isLoading = false;
                state.counters = action.payload.counters;
                state.activeData = action.payload.activeData;
                state.historyData = action.payload.historyData;
                state.error = null;
            })
            .addCase(fetchNotificaciones.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message || 'Error desconocido';
            });
    },
});

export const { setCounters, setActiveData, setHistoryData, clearNotificaciones } = notificacionesSlice.actions;

export const selectNotificacionesLoading = (state) => state.notificaciones.isLoading;
export const selectNotificacionesError = (state) => state.notificaciones.error;

export default notificacionesSlice.reducer;