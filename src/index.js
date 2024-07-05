// index.js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import store  from "./Reducer/store"; // Import your Redux store
import { GoogleOAuthProvider } from '@react-oauth/google';
ReactDOM.render(
  <React.StrictMode>
<GoogleOAuthProvider clientId="37860405828-rvm7gdgavq3t5llv0p4b46314kt5duqv.apps.googleusercontent.com">
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
