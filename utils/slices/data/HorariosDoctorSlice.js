import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService from '../../../Src/services/api/Api';

// 🔹 Thunk para obtener los horarios asignados al doctor logueado
export const fetchHorariosDoctor = createAsyncThunk(
    'horariosDoctor/fetchHorariosDoctor',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const doctorId = state.auth.user?.id;

            if (!doctorId) {
                console.warn('[HorariosDoctorSlice] (fetchHorariosDoctor) No se encontró ID del doctor logueado');
                return rejectWithValue('Usuario no autenticado o ID de doctor no disponible');
            }

            // Obtener horarios del doctor usando el endpoint filtrado
            const horariosResponse = await ApiService.getMisHorarios();

            if (!horariosResponse) {
                console.warn('[HorariosDoctorSlice] (fetchHorariosDoctor) Respuesta inválida de getHorariosByDoctor');
                return rejectWithValue('Respuesta inválida del servidor');
            }

            const horarios = horariosResponse;

            return horarios;
        } catch (error) {
            console.error('[HorariosDoctorSlice] | (fetchHorariosDoctor) \n ERROR:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error al obtener horarios del doctor');
        }
    }
);

const horariosDoctorSlice = createSlice({
    name: 'horariosDoctor',
    initialState: {
        horariosDoctor: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchHorariosDoctor
            .addCase(fetchHorariosDoctor.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHorariosDoctor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.horariosDoctor = action.payload;
                state.error = null;
            })
            .addCase(fetchHorariosDoctor.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message || 'Error desconocido';
            });
    },
});

export const selectHorariosDoctorLoading = (state) => state.horariosDoctor.isLoading;
export const selectHorariosDoctorError = (state) => state.horariosDoctor.error;

// 🔹 Selector para obtener un horario específico del doctor por ID
export const selectHorarioDoctorById = (id) => (state) =>
    state.horariosDoctor.horariosDoctor.find(horario => horario.id === id);

export default horariosDoctorSlice.reducer;