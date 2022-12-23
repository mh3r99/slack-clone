import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChannel: null,
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
  },
});

export const { setCurrentChannel } = channelsSlice.actions;

export default channelsSlice.reducer;
