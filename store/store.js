import { configureStore } from '@reduxjs/toolkit';
import booleanReducer from './booleanSlice';

export const store = configureStore({
    reducer: {
        boolean: booleanReducer,
    },
});
