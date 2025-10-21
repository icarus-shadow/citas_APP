import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Counters from '../../../Src/services/endpoints/counters/Counters';

export const fetchEspecialidadesCounter = createAsyncThunk(
    'especialidadesCounter/fetchEspecialidadesCounter',
    async (_, {rejectWithValue}) => {
        try {
            const response = await Counters.countEspecialidades();
            const count = response.count || response.total || 0;
            return count;
        } catch (error) {
            console.error('[EspecialidadesCounterSlice] \n (fetchEspecialidadesCounter)  \n error:', error);
            return rejectWithValue(error?.response?.data || error.message || 'error al obtener contador de especialidades');
        }
    }
);

const especialidadesCounterSlice = createSlice({
    name: 'especialidadesCounter',
    initialState: {
        especialidadesCount: 0,
        isLoading: false,
        error: null,
        lastUpdated: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEspecialidadesCounter.pending, (state) => {
                console.log('[fetch para especialidades count]');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchEspecialidadesCounter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.especialidadesCount = action.payload;
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(fetchEspecialidadesCounter.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message;
                console.log('[EspecialidadesCounterSlice] fetchEspecialidadesCounter rejected: \n ', state.error);
            });
    },
});

export default especialidadesCounterSlice.reducer;