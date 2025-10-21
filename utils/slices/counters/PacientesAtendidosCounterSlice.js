import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Counters from '../../../Src/services/endpoints/counters/Counters';

export const fetchPacientesAtendidosCounter = createAsyncThunk(
    'pacientesAtendidosCounter/fetchPacientesAtendidosCounter',
    async (doctorId, {rejectWithValue}) => {
        try {
            const response = await Counters.countPacientesAtendidos(doctorId);
            const count = response.count || response.total || 0;
            return count;
        } catch (error) {
            console.error('[PacientesAtendidosCounterSlice] \n (fetchPacientesAtendidosCounter)  \n error:', error);
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