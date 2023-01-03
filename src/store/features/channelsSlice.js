import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChannel: null,
  favoriteChannels: [],
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    setFavoriteChannel: (state, action) => {
      let channelId = action.payload.channelId;
      if (
        !state.favoriteChannels.find(
          (channel) => channel.channelId === channelId
        )
      )
        state.favoriteChannels.push(action.payload);
    },
    removeFavoriteChannel: (state, action) => {
      state.favoriteChannels = state.favoriteChannels.filter(
        (channel) => channel.channelId !== action.payload.channelId
      );
    },
  },
});

export const { setCurrentChannel, setFavoriteChannel, removeFavoriteChannel } =
  channelsSlice.actions;

export default channelsSlice.reducer;
