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
    }
});

export const { openChat, closeChat, fetchChatsRequest, fetchChatsSuccess, fetchChatsFailure } = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
