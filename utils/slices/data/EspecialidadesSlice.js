import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService from '../../../Src/services/api/Api';

export const fetchEspecialidades = createAsyncThunk(
    'especialidades/fetchEspecialidades',
    async (_, {rejectWithValue}) => {
        try {
            // Obtener lista de especialidades
            const response = await ApiService.request('/especialidades', {
                method: 'GET',
            });
            
            if (!response) {
                console.warn('[EspecialidadesSlice] (fetchEspecialidades) Respuesta inválida de getEspecialidades');
                return rejectWithValue('Respuesta inválida del servidor');
            }
            
            // Las especialidades no necesitan enriquecimiento con datos de usuario
            return response;
        } catch (error) {
            console.error('[EspecialidadesSlice] | (fetchEspecialidades) \n ERROR:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error al obtener especialidades');
        }
    }
);

const especialidadesSlice = createSlice({
    name: 'especialidades',
    initialState: {
        especialidades: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchEspecialidades
            .addCase(fetchEspecialidades.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchEspecialidades.fulfilled, (state, action) => {
                state.isLoading = false;
                state.especialidades = action.payload;
                state.error = null;
            })
            .addCase(fetchEspecialidades.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message || 'Error desconocido';
            });
    },
});


export const selectEspecialidadesLoading = (state) => state.especialidades.isLoading;
export const selectEspecialidadesError = (state) => state.especialidades.error;

// 🔹 Selector para obtener una especialidad específica por ID
export const selectEspecialidadById = (id) => (state) =>
    state.especialidades.especialidades.find(especialidad => especialidad.id === id);

export default especialidadesSlice.reducer;