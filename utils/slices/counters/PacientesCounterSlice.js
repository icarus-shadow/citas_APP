import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Counters from "../../../Src/services/endpoints/counters/Counters";

export const fetchPacientesCounter = createAsyncThunk(
    'pacientesCounter/fetchCitasCounter',
    async (_, { rejectWithValue }) => {
        try{
            const response = await Counters.countPacientes();
            const count = response.count || response.total || 0;
            return count;
        } catch (error) {
            console.error('[PacientesCounterSlice] \n (fetchPacientesCounter)  \n error:', error);
            return rejectWithValue(error?.response?.data || error.message || 'error al obtener contador de pacientes');
        }
    }
);

const pacientesCounterSlice = createSlice({
    name: 'pacientesCounter',
    initialState: {
        pacientesCount: 0,
        isLoading: false,
        error: null,
        lastUpdated: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPacientesCounter.pending, (state) => {
                console.log('[fetch para pacientes count]');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPacientesCounter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.pacientesCount = action.payload;
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(fetchPacientesCounter.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message;
                console.log('[PacientesCounterSlice] fetchPacientesCounter rejected: \n ', state.error);
            });
    },
});

export default pacientesCounterSlice.reducer;

