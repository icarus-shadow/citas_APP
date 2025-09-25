import { createSlice } from '@reduxjs/toolkit';

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState: {
        value: false,
    },
    reducers: {
        toggle: (state) => {
            state.value = !state.value;
        },
        setTrue: (state) => {
            state.value = true;
        },
        setFalse: (state) => {
            state.value = false;
        },
    },
});

export const { toggle, setTrue, setFalse } = darkModeSlice.actions;
export default darkModeSlice.reducer;
