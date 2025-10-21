import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Counters from '../../../Src/services/endpoints/counters/Counters';

export const fetchCitasAsignadasCounter = createAsyncThunk(
    'citasAsignadasCounter/fetchCitasAsignadasCounter',
    async (doctorId, {rejectWithValue}) => {
        try {
            const response = await Counters.countCitasAsignadas(doctorId);
            const count = response.count || response.total || 0;
            return count;
        } catch (error) {
            console.error('[CitasAsignadasCounterSlice] \n (fetchCitasAsignadasCounter)  \n error:', error);
            return rejectWithValue(error?.response?.data || error.message || 'error al obtener contador de citas asignadas');
        }
    }
);

const citasAsignadasCounterSlice = createSlice({
    name: 'citasAsignadasCounter',
    initialState: {
        citasAsignadasCount: 0,
        isLoading: false,
        error: null,
        lastUpdated: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCitasAsignadasCounter.pending, (state) => {
                console.log('[fetch para citas asignadas count]');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCitasAsignadasCounter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.citasAsignadasCount = action.payload;
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(fetchCitasAsignadasCounter.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message;
                console.log('[CitasAsignadasCounterSlice] fetchCitasAsignadasCounter rejected: \n ', state.error);
            });
    },
});

export default citasAsignadasCounterSlice.reducer;