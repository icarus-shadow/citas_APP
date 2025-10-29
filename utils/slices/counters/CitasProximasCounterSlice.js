import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Counters from '../../../Src/services/endpoints/counters/Counters';

export const fetchCitasProximasCounter = createAsyncThunk(
    'citasProximasCounter/fetchCitasProximasCounter',
    async (doctorId, {rejectWithValue}) => {
        try {
            console.log('[fetchCitasProximasCounter] Iniciando llamada a API con doctorId:', doctorId);
            const response = await Counters.countCitasProximas(doctorId);
            console.log('[fetchCitasProximasCounter] Respuesta de API:', response);
            console.log('[fetchCitasProximasCounter] Tipo de respuesta:', typeof response);
            console.log('[fetchCitasProximasCounter] Keys de respuesta:', Object.keys(response));
            const count = response.count || response.total || response.data?.count || response.data?.total || 0;
            console.log('[fetchCitasProximasCounter] Count calculado:', count);
            return count;
        } catch (error) {
            console.error('[CitasProximasCounterSlice] \n (fetchCitasProximasCounter)  \n error:', error);
            console.error('[CitasProximasCounterSlice] Error details:', error?.response?.data);
            return rejectWithValue(error?.response?.data || error.message || 'error al obtener contador de citas próximas');
        }
    }
);

const citasProximasCounterSlice = createSlice({
    name: 'citasProximasCounter',
    initialState: {
        citasProximasCount: 0,
        isLoading: false,
        error: null,
        lastUpdated: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCitasProximasCounter.pending, (state) => {
                console.log('[fetch para citas próximas count]');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCitasProximasCounter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.citasProximasCount = action.payload;
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(fetchCitasProximasCounter.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message;
                console.log('[CitasProximasCounterSlice] fetchCitasProximasCounter rejected: \n ', state.error);
            });
    },
});

export default citasProximasCounterSlice.reducer;