import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService from '../../../Src/services/api/Api';

export const fetchEspecialidadesDoctor = createAsyncThunk(
    'especialidadesDoctor/fetchEspecialidadesDoctor',
    async (_, {rejectWithValue}) => {
        try {
            // Obtener lista de especialidades para doctores
            const response = await ApiService.request('/especialidades', {
                method: 'GET',
            });

            if (!response) {
                console.warn('[EspecialidadesDoctorSlice] (fetchEspecialidadesDoctor) Respuesta inválida de getEspecialidades');
                return rejectWithValue('Respuesta inválida del servidor');
            }

            // Las especialidades no necesitan enriquecimiento con datos de usuario
            return response;
        } catch (error) {
            console.error('[EspecialidadesDoctorSlice] | (fetchEspecialidadesDoctor) \n ERROR:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error al obtener especialidades para doctores');
        }
    }
);

const especialidadesDoctorSlice = createSlice({
    name: 'especialidadesDoctor',
    initialState: {
        especialidadesDoctor: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchEspecialidadesDoctor
            .addCase(fetchEspecialidadesDoctor.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchEspecialidadesDoctor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.especialidadesDoctor = action.payload;
                state.error = null;
            })
            .addCase(fetchEspecialidadesDoctor.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message || 'Error desconocido';
            });
    },
});


export const selectEspecialidadesDoctorLoading = (state) => state.especialidadesDoctor.isLoading;
export const selectEspecialidadesDoctorError = (state) => state.especialidadesDoctor.error;

// 🔹 Selector para obtener una especialidad específica por ID para doctores
export const selectEspecialidadDoctorById = (id) => (state) =>
    state.especialidadesDoctor.especialidadesDoctor.find(especialidad => especialidad.id === id);

export default especialidadesDoctorSlice.reducer;