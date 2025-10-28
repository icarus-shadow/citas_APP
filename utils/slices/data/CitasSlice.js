import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService from '../../../Src/services/api/Api';

export const fetchCitas = createAsyncThunk(
    'citas/fetchCitas',
    async (_, {rejectWithValue}) => {
        try {
            const citasResponse = await ApiService.request('/citas', {
                method: 'GET',
            });

            if (!citasResponse) {
                console.warn('[CitasSlice] (fetchCitas) Respuesta inválida de getCitas');
                return rejectWithValue('Respuesta inválida del servidor');
            }

            const citas = citasResponse;
            return citas;
        } catch (error) {
            console.error('[CitasSlice] | (fetchCitas) \n ERROR:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error al obtener citas');
        }
    }
);

const citasSlice = createSlice({
    name: 'citas',
    initialState: {
        citas: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchCitas
            .addCase(fetchCitas.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCitas.fulfilled, (state, action) => {
                state.isLoading = false;
                state.citas = action.payload;
                state.error = null;
            })
            .addCase(fetchCitas.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message || 'Error desconocido';
            })
    },
});

export const selectCitasLoading = (state) => state.citas.isLoading;
export const selectCitasError = (state) => state.citas.error;

// 🔹 Selector para obtener una cita específica por ID
export const selectCitaById = (id) => (state) =>
    state.citas.citas.find(cita => cita.id === id);

export default citasSlice.reducer;