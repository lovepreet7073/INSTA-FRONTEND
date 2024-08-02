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
import Pagination from "./components/Pagination";
import Allusers from "./pages/Allusers";
import UserPost from "./pages/UserPost";
import MyProfile from "./pages/MyProfile";
import Password from "./pages/Password";
import Follow from "./pages/Follow";
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
import Comments from "./components/Comments";

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
          {!token ? (
            <>
              <Route path="/" element={<Navigate to="/register" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />
              <Route path="/verifyaccount/:id/:token" element={<Emailverify />} />
              <Route path="/resend-confirmation" element={<ResendConfirmation />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/allposts" />} />
              <Route path="/editprofile" element={<ProtectedRoute token={token}><EditProfile /></ProtectedRoute>} />
              <Route path="/createpost" element={<ProtectedRoute token={token}><CreatePost /></ProtectedRoute>} />
              <Route path="/updatepost" element={<ProtectedRoute token={token}><UpdatePost /></ProtectedRoute>} />
              <Route path="/allposts" element={<ProtectedRoute token={token}><Allposts /></ProtectedRoute>} />
              <Route path="/userinfo/:userId" element={<ProtectedRoute token={token}><Userinfo /></ProtectedRoute>} />
              <Route path="/pagination" element={<ProtectedRoute token={token}><Pagination /></ProtectedRoute>} />
              <Route path="/allusers" element={<ProtectedRoute token={token}><Allusers /></ProtectedRoute>} />
              <Route path="/userpost/:userId" element={<ProtectedRoute token={token}><UserPost /></ProtectedRoute>} />
              <Route path="/myprofile" element={<ProtectedRoute token={token}><MyProfile /></ProtectedRoute>} />
              <Route path="/password" element={<ProtectedRoute token={token}><Password /></ProtectedRoute>} />
              <Route path="/follow" element={<ProtectedRoute token={token}><Follow /></ProtectedRoute>} />
              <Route path="/chatpage" element={<ProtectedRoute token={token}><ChatPage /></ProtectedRoute>} />
              <Route path="/footer" element={<ProtectedRoute token={token}><Footer /></ProtectedRoute>} />
              <Route path="/comments" element={<ProtectedRoute token={token}><Comments /></ProtectedRoute>} />
              <Route path="/chatsidebar" element={<ProtectedRoute token={token}><ChatSidebar /></ProtectedRoute>} />
              <Route path="/videocall/:roomID" element={<ProtectedRoute token={token}><Videocall /></ProtectedRoute>} />
            </>
          )}
        </Routes>
        {token && <IncomingVideoCall />}
      </div>
    </div>
  );
};

export default App;
