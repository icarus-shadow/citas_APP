import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../../Src/services/api/Api';

export const fetchPerfil = createAsyncThunk(
    'perfil/fetchPerfil',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const rol = auth.user?.id_rol;

            const userA = await ApiService.getCurrentUser("/user");

            let data;
            switch (rol) {
                case 1: // Paciente
                    data = await ApiService.getPaciente("/mi-perfil");
                    break;
                case 2: // Doctor
                    data = await ApiService.getDoctor("/mi-perfil-doctor");
                    // Para doctores, también obtener especialidades
                    const especialidades = await ApiService.getEspecialidades();
                    data.especialidades = especialidades;
                    break;
                case 3: // Administrador
                    data = await ApiService.getAdmin("/mi-perfil-admin");
                    break;
                default:
                    return rejectWithValue('Rol de usuario no válido');
            }

            return { usuario: data, email: userA.email, especialidades: data.especialidades || [] };
        } catch (error) {
            console.error('[PerfilSlice] | (fetchPerfil) \n ERROR:', error);
            return rejectWithValue(error?.response?.data?.message || error.message || 'Error al obtener perfil');
        }
    }
);

const perfilSlice = createSlice({
    name: 'perfil',
    initialState: {
        usuario: null,
        email: null,
        especialidades: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setPerfil: (state, action) => {
            state.usuario = action.payload.usuario;
            state.email = action.payload.email;
            state.especialidades = action.payload.especialidades || [];
        },
        clearPerfil: (state) => {
            state.usuario = null;
            state.email = null;
            state.especialidades = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPerfil.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPerfil.fulfilled, (state, action) => {
                state.isLoading = false;
                state.usuario = action.payload.usuario;
                state.email = action.payload.email;
                state.especialidades = action.payload.especialidades;
                state.error = null;
            })
            .addCase(fetchPerfil.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setPerfil, clearPerfil } = perfilSlice.actions;

export const selectPerfilLoading = (state) => state.perfil.isLoading;
export const selectPerfilError = (state) => state.perfil.error;

export default perfilSlice.reducer;