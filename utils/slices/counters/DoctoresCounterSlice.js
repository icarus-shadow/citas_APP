import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Counters from '../../../Src/services/endpoints/counters/Counters';

export const fetchDoctoresCounter = createAsyncThunk(
    'doctoresCounter/fetchDoctoresCounter',
    async (_, {rejectWithValue}) => {
        try {
            const response = await Counters.countDoctores();
            const count = response.count || response.total || 0;
            return count;
        } catch (error) {
            console.error('[DoctoresCounterSlice] \n (fetchDoctoresCounter)  \n error:', error);
            return rejectWithValue(error?.response?.data || error.message || 'error al obtener contador de doctores');
        }
    }
);

const doctoresCounterSlice = createSlice({
    name: 'doctoresCounter',
    initialState: {
        doctoresCount: 0,
        isLoading: false,
        error: null,
        lastUpdated: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoctoresCounter.pending, (state) => {
                console.log('[fetch para doctores count]');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDoctoresCounter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctoresCount = action.payload;
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(fetchDoctoresCounter.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message;
                console.log('[DoctoresCounterSlice] fetchDoctoresCounter rejected: \n ', state.error);
            });
    },
});

export default doctoresCounterSlice.reducer;