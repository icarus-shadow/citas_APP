import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Counters from '../../../Src/services/endpoints/counters/Counters';

export const fetchCitasProximasCounter = createAsyncThunk(
    'citasProximasCounter/fetchCitasProximasCounter',
    async (doctorId, {rejectWithValue}) => {
        try {
            const response = await Counters.countCitasProximas(doctorId);
            const count = response.count || response.total || 0;
            return count;
        } catch (error) {
            console.error('[CitasProximasCounterSlice] \n (fetchCitasProximasCounter)  \n error:', error);
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