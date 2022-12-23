import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import channelsReducer from "./features/channelsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    channels: channelsReducer,
  },
  devTools: true,
});
