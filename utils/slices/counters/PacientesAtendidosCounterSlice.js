import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Counters from '../../../Src/services/endpoints/counters/Counters';

export const fetchPacientesAtendidosCounter = createAsyncThunk(
    'pacientesAtendidosCounter/fetchPacientesAtendidosCounter',
    async (doctorId, {rejectWithValue}) => {
        try {
            console.log('[fetchPacientesAtendidosCounter] Iniciando llamada a API con doctorId:', doctorId);
            const response = await Counters.countPacientesAtendidos(doctorId);
            console.log('[fetchPacientesAtendidosCounter] Respuesta de API:', response);
            console.log('[fetchPacientesAtendidosCounter] Respuesta completa:', JSON.stringify(response, null, 2));
            const count = response.count || response.total || 0;
            console.log('[fetchPacientesAtendidosCounter] Count calculado:', count);
            console.log('[fetchPacientesAtendidosCounter] Verificando si hay citas nuevas sin contar...');
            return count;
        } catch (error) {
            console.error('[PacientesAtendidosCounterSlice] \n (fetchPacientesAtendidosCounter)  \n error:', error);
            console.error('[PacientesAtendidosCounterSlice] Error detallado:', error?.response?.data);
            return rejectWithValue(error?.response?.data || error.message || 'error al obtener contador de pacientes atendidos');
        }
    }
);

const pacientesAtendidosCounterSlice = createSlice({
    name: 'pacientesAtendidosCounter',
    initialState: {
        pacientesAtendidosCount: 0,
        isLoading: false,
        error: null,
        lastUpdated: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPacientesAtendidosCounter.pending, (state) => {
                console.log('[fetch para pacientes atendidos count]');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPacientesAtendidosCounter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.pacientesAtendidosCount = action.payload;
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(fetchPacientesAtendidosCounter.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message;
                console.log('[PacientesAtendidosCounterSlice] fetchPacientesAtendidosCounter rejected: \n ', state.error);
            });
    },
});

export default pacientesAtendidosCounterSlice.reducer;