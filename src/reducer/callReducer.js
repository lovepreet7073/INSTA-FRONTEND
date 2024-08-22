// callSlice.js
import { createSlice } from "@reduxjs/toolkit";

const callSlice = createSlice({
  name: "call",
  initialState: {
    incomingCall: null,
    callOngoing: false,
  },
  reducers: {
    setIncomingCall: (state, action) => {
      state.incomingCall = action.payload;
    },
    clearIncomingCall: (state) => {
      state.incomingCall = null;
    },
    startCall: (state) => {
      state.callOngoing = true;
    },
    endCall: (state) => {
      state.callOngoing = false;
      state.incomingCall = null;
    },
  },
});

export const { setIncomingCall, clearIncomingCall, startCall, endCall } = callSlice.actions;

export const callReducer = callSlice.reducer;
