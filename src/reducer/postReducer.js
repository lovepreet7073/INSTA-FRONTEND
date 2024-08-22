import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  posts: [],
  selectedPost: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addPost: (state, action) => {
      const newPost = action.payload;
      if (newPost && typeof newPost === 'object') {
        state.posts.push(newPost);
      } else {
        console.error('addPost: Expected payload to be an object, got:', newPost);
      }
    },
    deletePost(state, action) {
      const postIdToDelete = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postIdToDelete);
    },
    setSelectedPost(state, action) {
      const postIdToSelect = action.payload;

      const selectedPost = state.posts.find(
        (post) => post._id === postIdToSelect
      );

      state.selectedPost = selectedPost;
    },
    
  },
});

export const { addPost, deletePost, setSelectedPost } = postSlice.actions;

export const postReducer = postSlice.reducer;
