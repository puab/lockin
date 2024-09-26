import { createSlice } from '@reduxjs/toolkit';

type AppState = {
    isLoaded: boolean;
};

const initialState: AppState = {
    isLoaded: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {},
});

export default appSlice.reducer;
