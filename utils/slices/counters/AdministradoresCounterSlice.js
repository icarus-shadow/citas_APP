import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Counters from '../../../Src/services/endpoints/counters/Counters';

export const fetchAdministradoresCounter = createAsyncThunk(
    'administradoresCounter/fetchAdministradoresCounter',
    async (_, {rejectWithValue}) => {
        try {
            const response = await Counters.countAdministradores();
            const count = response.count || response.total || 0;
            return count;
        } catch (error) {
            console.error('[AdministradoresCounterSlice] \n (fetchAdministradoresCounter)  \n error:', error);
            return rejectWithValue(error?.response?.data || error.message || 'error al obtener contador de administradores');
        }
    }
);

const administradoresCounterSlice = createSlice({
    name: 'administradoresCounter',
    initialState: {
        administradoresCount: 0,
        isLoading: false,
        error: null,
        lastUpdated: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdministradoresCounter.pending, (state) => {
                console.log('[fetch para administradores count]');
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdministradoresCounter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.administradoresCount = action.payload;
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(fetchAdministradoresCounter.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message;
                console.log('[AdministradoresCounterSlice] fetchAdministradoresCounter rejected: \n ', state.error);
            });
    },
});

export default administradoresCounterSlice.reducer;