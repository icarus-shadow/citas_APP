import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService from '../../../Src/services/api/Api';


export const fetchPacientes = createAsyncThunk(
    'pacientes/fetchPacientes',
    async (_, {rejectWithValue}) => {
        try {
            // Obtener lista de pacientes
            const pacientesResponse = await ApiService.request('/pacientes', {
                method: 'GET',
            });
            
            if (!pacientesResponse) {
                console.warn('[PacientesSlice] (fetchPacientes) Respuesta inválida de getPacientes');
                return rejectWithValue('Respuesta inválida del servidor');
            }
            const pacientes = pacientesResponse;
            return pacientes;
        } catch (error) {
            console.error('[PacientesSlice] | (fetchPacientes) \n ERROR:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error al obtener pacientes');
        }
    }
);
// 🔹 Slice de pacientes
const pacientesSlice = createSlice({
    name: 'pacientes',
    initialState: {
        pacientes: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchPacientes
            .addCase(fetchPacientes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPacientes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.pacientes = action.payload;
                state.error = null;
            })
            .addCase(fetchPacientes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message || 'Error desconocido';
            });
    },
});

export const selectPacientesLoading = (state) => state.pacientes.isLoading;
export const selectPacientesError = (state) => state.pacientes.error;

// 🔹 Selector para obtener un paciente específico por ID
export const selectPacienteById = (id) => (state) =>
    state.pacientes.pacientes.find(paciente => paciente.id === id);

export default pacientesSlice.reducer;
