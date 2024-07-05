import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  userData: {
    name: "",
    email: "",
    mobile: "",
    userId: "",
    profileImage: "",
  
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },
    logout(state) {
      state.userData = initialState.userData;
    }
 
  },
});

export const { setUserData,logout } = userSlice.actions;

export const userReducer = userSlice.reducer;

