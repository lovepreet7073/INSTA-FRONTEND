import React, { createContext, useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "./Reducer/UseReducer";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import CreatePost from "./pages/CreatePost";
import EditProfile from "./pages/EditProfile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UpdatePost from "./pages/UpdatePost";
import Allposts from "./pages/Allposts";
import Userinfo from "./components/Userinfo";
import Allusers from "./pages/Allusers";
import UserPost from "./pages/UserPost";
import MyProfile from "./pages/MyProfile";
import Password from "./pages/Password";
import ForgotPassword from "./components/forgotpassword";
import ChatPage from "./pages/ChatPage";
import ResetPassword from "./components/resetPassword";
import Emailverify from "./pages/Emailverify";
import ResendConfirmation from "./components/ResendConfirmation";
import Videocall from "./components/Videocall";
import ChatSidebar from "./components/chatSidebar";
import IncomingVideoCall from "./components/IncomingVideoCall"
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

export const UserContext = createContext();

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwttoken");

  const getUser = async () => {
    if (token) {
      try {
        const res = await fetch("http://localhost:5000/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          localStorage.removeItem("jwttoken"); // Remove invalid token if any
          throw new Error("Failed to fetch user data");
        }

        const userData = await res.json();
        dispatch(setUserData(userData));
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="app-container d-flex">
      
      {token && <Sidebar />}
      <div
        className={`${
          token ? "content flex-grow-1" : "flex-grow-1"
        }`}
      >
      <Routes>
              <Route path="/" element={<Navigate to="/register" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={token ? <Navigate to="/myprofile" />:<Login />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />
              <Route path="/verifyaccount/:id/:token" element={<Emailverify />} />
              <Route path="/resend-confirmation" element={<ResendConfirmation />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/" element={<Navigate to="/allposts" />} />
              <Route path="/editprofile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/createpost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/updatepost" element={<ProtectedRoute><UpdatePost /></ProtectedRoute>} />
              <Route path="/allposts" element={<ProtectedRoute><Allposts /></ProtectedRoute>} />
              <Route path="/userinfo/:userId" element={<ProtectedRoute><Userinfo /></ProtectedRoute>} />
      
              <Route path="/allusers" element={<ProtectedRoute><Allusers /></ProtectedRoute>} />
              <Route path="/userpost/:userId" element={<ProtectedRoute><UserPost /></ProtectedRoute>} />
              <Route path="/myprofile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
              <Route path="/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
              <Route path="/chatpage" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/footer" element={<ProtectedRoute><Footer /></ProtectedRoute>} />
              <Route path="/chatsidebar" element={<ProtectedRoute><ChatSidebar /></ProtectedRoute>} />
              <Route path="/videocall/:roomID" element={<ProtectedRoute><Videocall /></ProtectedRoute>} />
        </Routes>
        {token && <IncomingVideoCall />}
      </div>
    </div>
  );
};

export default App;
