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
    logout: (state, action) => (state = initialState),
  },
});

export const { setLoggedUser, logout } = userSlice.actions;

export default userSlice.reducer;
