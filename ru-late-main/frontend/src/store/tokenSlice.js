import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null
};

// Creates slice with reducers to set and remove token from the store
const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
        },
        removeToken(state) {
            state.token = null;
        }
    }
});

export const { setToken, removeToken } = tokenSlice.actions;

export default tokenSlice.reducer;