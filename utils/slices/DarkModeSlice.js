import { createSlice } from '@reduxjs/toolkit';

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState: {
        value: true,
    },
    reducers: {
        toggle: (state) => {
            state.value = !state.value;
            console.log('[DarkModeSlice] toggle — new value:', state.value);
        },
        setTrue: (state) => {
            state.value = true;
            console.log('[DarkModeSlice] setTrue — value set to true');
        },
        setFalse: (state) => {
            state.value = false;
            console.log('[DarkModeSlice] setFalse — value set to false');
        },
    },
});

export const { toggle, setTrue, setFalse } = darkModeSlice.actions;
export default darkModeSlice.reducer;
