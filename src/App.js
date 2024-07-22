import React, { createContext, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import CreatePost from "./pages/CreatePost";
import Footer from "./components/Footer";

import "./App.css";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom"; // Import Routes component
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./Reducer/UseReducer";
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
import Sidebar from "./components/Sidebar";
import ChatSidebar from "./components/chatSidebar";
export const UserContext = createContext();

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwttoken");
  
  const getUser = async () => {
    if (token) {
      try {
        const res = await fetch('http://localhost:5000/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!res.ok) {
          localStorage.removeItem('jwttoken'); // Remove invalid token if any
          throw new Error('Failed to fetch user data');
        }

        const userData = await res.json();
        dispatch(setUserData(userData));
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="app-container d-flex">
      {token ?    <Sidebar />:""}
      <div className={` ${token ? "content flex-grow-1 bg-light" : "flex-grow-1 bg-light"}`}>
        
        <Routes>
          {!token && (
            <>
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />
              <Route path="/verifyaccount/:id/:token" element={<Emailverify />} />
              <Route path="/resend-confirmation" element={<ResendConfirmation />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
            </>
          )}
          {token && (
            <>
              <Route path="/editprofile" element={<EditProfile />} />
              <Route path="/createpost" element={<CreatePost />} />
              <Route path="/updatepost" element={<UpdatePost />} />
              <Route path="/allposts" element={<Allposts />} />
              <Route path="/userinfo/:userId" element={<Userinfo />} />
              <Route path="/pagination" element={<Pagination />} />
              <Route path="/allusers" element={<Allusers />} />
              <Route path="/userpost/:userId" element={<UserPost />} />
              <Route path="/myprofile" element={<MyProfile />} />
              <Route path="/password" element={<Password />} />
              <Route path="/follow" element={<Follow />} />
              <Route path="/chatpage" element={<ChatPage />} />
              <Route path="/footer" element={<Footer />} />
              <Route path="/chatsidebar" element={<ChatSidebar />} />
              <Route path="/videocall/:roomID" element={<Videocall />} />
            </>
          )}
        </Routes>
        {/* {token && <Footer />} */}
      </div>
    </div>
  );
};

export default App;
