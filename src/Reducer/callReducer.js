import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videoCall: null,
  incomingVideoCall: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setVideoCall(state, action) {
        const { type, user, roomId } = action.payload;
        state.videoCall = { type, user, roomId };
      state.incomingVideoCall = null; 
    },
    endCall(state) {
      state.videoCall = null;
      state.incomingVideoCall = null;
    },
    setIncomingCall(state, action) {
      const { type, user, roomId } = action.payload;
      state.incomingVideoCall = { type, user, roomId };
    },
    setcurrentChatdUser(state, action) {  // Add setSelectedUser action
        state.selectedUser = action.payload;
      },
  },
});

export const { setVideoCall, endCall, setIncomingCall } = callSlice.actions;

export const callReducer = callSlice.reducer;
