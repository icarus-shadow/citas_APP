import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/AuthSlice';
import darkModeReducer from '../slices/DarkModeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        darkMode: darkModeReducer,
    },
});
