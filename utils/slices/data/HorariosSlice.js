import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService from '../../../Src/services/api/Api';

// 🔹 Thunk para obtener todos los horarios con datos completos
export const fetchHorarios = createAsyncThunk(
    'horarios/fetchHorarios',
    async (_, {rejectWithValue}) => {
        try {
            // Obtener lista de horarios
            const horariosResponse = await ApiService.request('/horarios', {
                method: 'GET',
            });

            if (!horariosResponse) {
                console.warn('[HorariosSlice] (fetchHorarios) Respuesta inválida de getHorarios');
                return rejectWithValue('Respuesta inválida del servidor');
            }

            const horarios = horariosResponse;

            return horarios;
        } catch (error) {
            console.error('[HorariosSlice] | (fetchHorarios) \n ERROR:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error al obtener horarios');
        }
    }
);
const horariosSlice = createSlice({
    name: 'horarios',
    initialState: {
        horarios: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchHorarios
            .addCase(fetchHorarios.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHorarios.fulfilled, (state, action) => {
                state.isLoading = false;
                state.horarios = action.payload;
                state.error = null;
            })
            .addCase(fetchHorarios.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message || 'Error desconocido';
            });
    },
});


export const selectHorariosLoading = (state) => state.horarios.isLoading;
export const selectHorariosError = (state) => state.horarios.error;

// 🔹 Selector para obtener un horario específico por ID
export const selectHorarioById = (id) => (state) =>
    state.horarios.horarios.find(horario => horario.id === id);

export default horariosSlice.reducer;