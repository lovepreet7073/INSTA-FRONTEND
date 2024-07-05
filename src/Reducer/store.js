import { configureStore } from "@reduxjs/toolkit";
import { postReducer } from "./postReducer";
import { userReducer } from "./UseReducer";
import { chatReducer } from "./chatReducer";
import { notificationsReducer } from "./notification";
const rootReducer = {
  post: postReducer,
  user: userReducer,
  chat: chatReducer,
  notifications: notificationsReducer,

};

const store = configureStore({
  reducer: rootReducer,

});

export default store;
