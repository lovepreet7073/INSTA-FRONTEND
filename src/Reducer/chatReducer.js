import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedChat: null,
    chats: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        openChat(state, action) {
            state.selectedChat = action.payload;
        },
        closeChat(state) {
            state.selectedChat = null;
        },
        fetchChatsRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchChatsSuccess(state, action) {
            state.chats = action.payload;
        },
        fetchChatsFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateSelectedUsers(state, action) {
            // Assuming action.payload contains updated users array
            state.selectedChat.users = action.payload;
        },
    }
});

export const { openChat, closeChat, fetchChatsRequest, fetchChatsSuccess, fetchChatsFailure,updateSelectedUsers } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
