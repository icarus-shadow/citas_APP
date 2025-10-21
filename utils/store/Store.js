import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/AuthSlice';
import darkModeReducer from '../slices/DarkModeSlice';

// counters
import citasCounterReducer from '../slices/counters/CitasCounterSlice'
import pacientesCounterReducer from '../slices/counters/PacientesCounterSlice'
import doctoresCounterReducer from '../slices/counters/DoctoresCounterSlice'
import administradoresCounterReducer from '../slices/counters/AdministradoresCounterSlice'
import especialidadesCounterReducer from '../slices/counters/EspecialidadesCounterSlice'
import horariosCounterReducer from '../slices/counters/HorariosCounterSlice'
import citasAsignadasCounterReducer from '../slices/counters/CitasAsignadasCounterSlice'
import citasProximasCounterReducer from '../slices/counters/CitasProximasCounterSlice'
import pacientesAtendidosCounterReducer from '../slices/counters/PacientesAtendidosCounterSlice'

// data
import pacientesReducer from '../slices/data/PacientesSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        darkMode: darkModeReducer,
        // counters
        citasCounter: citasCounterReducer,
        pacientesCounter: pacientesCounterReducer,
        doctoresCounter: doctoresCounterReducer,
        administradoresCounter: administradoresCounterReducer,
        especialidadesCounter: especialidadesCounterReducer,
        horariosCounter: horariosCounterReducer,
        citasAsignadasCounter: citasAsignadasCounterReducer,
        citasProximasCounter: citasProximasCounterReducer,
        pacientesAtendidosCounter: pacientesAtendidosCounterReducer,

        // data
        pacientes: pacientesReducer,
    },
});
