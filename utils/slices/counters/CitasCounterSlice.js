import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Counters from '../../../Src/services/endpoints/counters/Counters';

export const fetchCitasCounter = createAsyncThunk(
    'citasCounter/fetchCitasCounter',
    async (_, {rejectWithValue}) => {
        try {
            const response = await Counters.countCitas();
            const count = response.count || response.total || 0;
            return count;
        } catch (error) {
            console.error('[CitasCounterSlice] \n (fechCitasCounter)  \n error:', error);
            return rejectWithValue(error?.response?.data || error.message || 'error al obtener contador de citas');
        }
    }
);

const citasCounterSlice = createSlice({
    name: 'citasCounter',
    initialState: {
        citasCount: 0,
        isLoading: false,
        error: null,
        lastUpdated: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCitasCounter.pending, (state) => {
                console.log('[fetch para citas count]');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCitasCounter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.citasCount = action.payload;
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(fetchCitasCounter.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message;
                console.log('[CitasCounterSlice] fetchCitasCounter rejected: \n ', state.error);
            });
    },
});

export default citasCounterSlice.reducer;