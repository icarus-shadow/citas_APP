import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Counters from '../../../Src/services/endpoints/counters/Counters';

export const fetchHorariosCounter = createAsyncThunk(
    'horariosCounter/fetchHorariosCounter',
    async (_, {rejectWithValue}) => {
        try {
            const response = await Counters.countHorarios();
            const count = response.count || response.total || 0;
            return count;
        } catch (error) {
            console.error('[HorariosCounterSlice] \n (fetchHorariosCounter)  \n error:', error);
            return rejectWithValue(error?.response?.data || error.message || 'error al obtener contador de horarios');
        }
    }
);

const horariosCounterSlice = createSlice({
    name: 'horariosCounter',
    initialState: {
        horariosCount: 0,
        isLoading: false,
        error: null,
        lastUpdated: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHorariosCounter.pending, (state) => {
                console.log('[fetch para horarios count]');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHorariosCounter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.horariosCount = action.payload;
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(fetchHorariosCounter.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message;
                console.log('[HorariosCounterSlice] fetchHorariosCounter rejected: \n ', state.error);
            });
    },
});

export default horariosCounterSlice.reducer;