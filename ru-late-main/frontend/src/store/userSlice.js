import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null
};

// Create slice with reducers to set and remove user from the store
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        removeUser(state) {
            state.user = null;
        }
    }
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;