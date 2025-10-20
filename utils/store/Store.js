import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/AuthSlice';
import darkModeReducer from '../slices/DarkModeSlice';

// counters
import pacientesCounterReducer from '../slices/counters/PacientesCounterSlice'

// data
import pacientesReducer from '../slices/data/PacientesSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        darkMode: darkModeReducer,
        // counters
        pacientesCounter: pacientesCounterReducer,

        // data
        pacientes: pacientesReducer,
    },
});
