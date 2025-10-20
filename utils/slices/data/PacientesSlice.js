import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiService from '../../../Src/services/api/Api';


export const fetchPacientes = createAsyncThunk(
    'pacientes/fetchPacientes',
    async (_, {rejectWithValue}) => {
        try{
            const pacientesResponse = await ApiService.getPacientes();
            if (!pacientesResponse) {
                console.warn('[PacientesSlice] (fetchPacientes) Respuesta inválida de getPacientes');
                return rejectWithValue('Respuesta inválida del servidor');
            }
            const pacientes = pacientesResponse;
            const pacientesCompletos = await Promise.all(
               pacientes.map(async (paciente) => {
                   try{
                       const userData = await ApiService.getUserById(paciente.user_id);
                       const pacienteCompleto = {
                           ...paciente,
                           userData: userData,
                       };

                       return pacienteCompleto;
                   } catch (error) {
                       return paciente
                   }
               }) 
            );
            return pacientesCompletos;
        } catch (error ) {
            console.error('[PacientesSlice] | (fetchPacientes) \n ERROR:', error);
            return rejectWithValue(error?.response?.data || error.message || 'error  al obtener pacientes');
        }
    }
);
 export const updatePaciente = createAsyncThunk(
     'pacientes/updatePaciente',
     async ({id, data}, {rejectWithValue, getState}) => {
         try{
             const currentState = getState().pacientes;
             const pacienteActual = currentState.pacientes.find(p => p.id === id);

             if (!pacienteActual) {
                 console.warn(`[PacientesSlice] Paciente con ID ${id} no encontrado en el estado actual`);
                 return rejectWithValue('Paciente no encontrado');
             }
             const hasChanges = Object.keys(data).some(key => {
                   const currentValue = pacienteActual[key];
                   const newValue = data[key];
                   const changed = currentValue !== newValue;
                   return changed;
             });

             if (!hasChanges) {
                 return pacienteActual;
             }

             const response = await ApiService.updatePaciente(data);
             if (!response || !response.data) {
                 console.warn('[PacientesSlice] Respuesta inválida de updatePaciente');
                 return rejectWithValue('Respuesta inválida del servidor');
             }

             const pacienteActualizado = response.data;
             return pacienteActualizado;
         } catch (error) {
             console.error(`[PacientesSlice] Error en updatePaciente para ID ${id}:`, error);
             return rejectWithValue(error?.response?.data || error.message || 'Error al actualizar paciente');
         }
     }
 );

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
             })
             .addCase(updatePaciente.pending, (state) => {
                 state.isLoading = true;
                 state.error = null;
             })
             .addCase(updatePaciente.fulfilled, (state, action) => {
                 state.isLoading = false;
                 const index = state.pacientes.findIndex(p => p.id === action.payload.id);
                 if (index !== -1) {
                     state.pacientes[index] = action.payload;
                 } else {
                     console.warn(`[PacientesSlice] Paciente ${action.payload.id} no encontrado para actualizar en el estado`);
                 }
                 state.error = null;
             })
             .addCase(updatePaciente.rejected, (state, action) => {
                 state.isLoading = false;
                 state.error = action.payload || action.error?.message || 'Error desconocido';
             });
     },
 })

// 🔹 Selectores para acceder al estado
export const selectPacientes = (state) => state.pacientes.pacientes;
export const selectPacientesLoading = (state) => state.pacientes.isLoading;
export const selectPacientesError = (state) => state.pacientes.error;

// 🔹 Selector para obtener un paciente específico por ID
export const selectPacienteById = (id) => (state) =>
    state.pacientes.pacientes.find(paciente => paciente.id === id);

export default pacientesSlice.reducer;



