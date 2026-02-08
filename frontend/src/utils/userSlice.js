import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        addUser: (state, action) => {
            return action.payload; // Updates state with the user data
        },
        removeUser: (state, action) => {
            return null; // Clears state on logout
        },
    },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;