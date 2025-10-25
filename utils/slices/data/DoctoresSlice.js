import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService from '../../../Src/services/api/Api';

// 🔹 Thunk para obtener todos los doctores con datos completos
export const fetchDoctores = createAsyncThunk(
    'doctores/fetchDoctores',
    async (_, {rejectWithValue}) => {
        try {
            // Obtener lista de doctores
            const doctoresResponse = await ApiService.request('/doctores', {
                method: 'GET',
            });


            if (!doctoresResponse) {
                return rejectWithValue('Respuesta inválida del servidor');
            }

            const doctores = doctoresResponse;
            return doctores;

        } catch (error) {
            console.error('[DoctoresSlice] | (fetchDoctores) \n ERROR:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error al obtener doctores');
        }
    }
);

const doctoresSlice = createSlice({
    name: 'doctores',
    initialState: {
        doctores: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchDoctores
            .addCase(fetchDoctores.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDoctores.fulfilled, (state, action) => {
                state.isLoading = false;
                state.doctores = action.payload;
                state.error = null;
            })
            .addCase(fetchDoctores.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message || 'Error desconocido';
            });
    },
});


export const selectDoctoresLoading = (state) => state.doctores.isLoading;
export const selectDoctoresError = (state) => state.doctores.error;

// 🔹 Selector para obtener un doctor específico por ID
export const selectDoctorById = (id) => (state) =>
    state.doctores.doctores.find(doctor => doctor.id === id);

export default doctoresSlice.reducer;