import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedUser: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
    },
    clearUser: (state, action) => {
      state.currentUser = null;
      state.isLoading = false;
    },
  },
});

export const { setLoggedUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
