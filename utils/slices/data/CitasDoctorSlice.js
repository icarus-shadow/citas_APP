import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CitasDoctor from '../../../Src/services/endpoints/CitasDoctor';

export const fetchCitasDoctor = createAsyncThunk(
    'citasDoctor/fetchCitasDoctor',
    async (_, {rejectWithValue}) => {
        try {
            console.log('[CitasDoctorSlice] (fetchCitasDoctor) Iniciando petición a getCitas');
            const citasResponse = await CitasDoctor.getCitas();
            console.log('[CitasDoctorSlice] (fetchCitasDoctor) Respuesta de getCitas:', citasResponse);
            console.log('[CitasDoctorSlice] (fetchCitasDoctor) Tipo de respuesta:', typeof citasResponse, 'Es array?', Array.isArray(citasResponse));

            if (!citasResponse) {
                console.warn('[CitasDoctorSlice] (fetchCitasDoctor) Respuesta inválida de getCitas');
                return rejectWithValue('Respuesta inválida del servidor');
            }

            const citas = citasResponse;
            console.log('[CitasDoctorSlice] (fetchCitasDoctor) Citas obtenidas:', citas.length, 'citas');
            console.log('[CitasDoctorSlice] (fetchCitasDoctor) Primera cita (si existe):', citas[0] || 'No hay citas');
            console.log('[CitasDoctorSlice] (fetchCitasDoctor) Resumen de citas por tipo y estado:', citas.reduce((acc, c) => {
                const key = `${c.tipo}-${c.estado}`;
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {}));
            console.log('[CitasDoctorSlice] (fetchCitasDoctor) Filtros aplicados en backend para getCitas: Ninguno (devuelve todas las citas del doctor)');
            return citas;
        } catch (error) {
            console.error('[CitasDoctorSlice] | (fetchCitasDoctor) \n ERROR:', error);
            return rejectWithValue(error?.response?.data || error.message || 'Error al obtener citas del doctor');
        }
    }
);

const citasDoctorSlice = createSlice({
    name: 'citasDoctor',
    initialState: {
        citasDoctor: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchCitasDoctor
            .addCase(fetchCitasDoctor.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCitasDoctor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.citasDoctor = action.payload;
                state.error = null;
            })
            .addCase(fetchCitasDoctor.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error?.message || 'Error desconocido';
            })
    },
});

export const selectCitasDoctorLoading = (state) => state.citasDoctor.isLoading;
export const selectCitasDoctorError = (state) => state.citasDoctor.error;

// 🔹 Selector para obtener una cita específica del doctor por ID
export const selectCitaDoctorById = (id) => (state) =>
    state.citasDoctor.citasDoctor.find(cita => cita.id === id);

export default citasDoctorSlice.reducer;