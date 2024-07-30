// callSlice.js
import { createSlice } from "@reduxjs/toolkit";

const callSlice = createSlice({
  name: "call",
  initialState: {
    incomingCall: null,
  },
  reducers: {
    setIncomingCall: (state, action) => {
      state.incomingCall = action.payload;
    },
    clearIncomingCall: (state) => {
      state.incomingCall = null;
    },
  },
});

export const { setIncomingCall, clearIncomingCall } = callSlice.actions;

export const callReducer = callSlice.reducer;
