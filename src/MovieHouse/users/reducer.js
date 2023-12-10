import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    signOut(state) {
      state.currentUser = null; // Reset the currentUser to null when signing out
    },
  },
});

export const { setCurrentUser, signOut } = userSlice.actions;

export default userSlice.reducer;
