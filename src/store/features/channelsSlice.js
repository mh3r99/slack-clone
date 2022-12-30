import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChannel: null,
  isPrivateChannel: false,
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    setPrivateChannel: (state, action) => {
      state.isPrivateChannel = action.payload;
    },
  },
});

export const { setCurrentChannel, setPrivateChannel } = channelsSlice.actions;

export default channelsSlice.reducer;
