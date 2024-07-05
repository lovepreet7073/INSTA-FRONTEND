import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/instalogo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from '../Reducer/UseReducer';
import Swal from "sweetalert2";
import "../assets/css/navbar.css";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const isAuthorized =
    localStorage.getItem("jwttoken") && Object.keys(userData).length > 0;
  const logoutUser = async () => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "Do you really want to log out?",
        showCancelButton: true,
        confirmButtonText: "Yes, log out",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-secondary",
        },
      });

      if (result.isConfirmed) {
        const res = await fetch(`http://localhost:5000/logout`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.status === 200) {
          localStorage.removeItem("jwttoken");
          dispatch(logout());
          navigate("/login", { replace: true });
        } else {
          const error = new Error(res.error);
          throw error;
        }
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const loginStatus = () => {


    if (isAuthorized) {
      return [
        <>
          <NavLink to="/home">
            <li>Home</li>
          </NavLink>

          <NavLink to="/allusers">
            <li>All Users</li>
          </NavLink>
          <NavLink to="/allposts">
            <li>All Posts</li>
          </NavLink>
          <NavLink to="/chatpage">
            <li>Chat</li>
          </NavLink>
          <NavLink to="/myprofile">
            <li>Profile</li>
          </NavLink>
          <button className="primary-btn" onClick={logoutUser}>
            Log Out
          </button>

        </>
      ];

    } else {
      return [
        <>
        
          <NavLink to="/register">
            <li>SignUp</li>
          </NavLink>
          <NavLink to="/login">
            <li>SignIn</li>
          </NavLink>
        </>
      ]
    }
  }
  const loginMobile = () => {
    const isAuthorized = localStorage.getItem("jwttoken");
    if (isAuthorized) {
      return [
        <>
          <NavLink to="/allusers">
            <li><span style={{color:"black"
              }}class="material-symbols-outlined">
              group
            </span></li>
          </NavLink>
          <NavLink to="/allposts">
            <li><span   style={{color:"black"
              }}class="material-symbols-outlined">
              perm_media
            </span></li>
          </NavLink>
          <NavLink to="/chatpage">
            <li><span  style={{color:"black"
              }} class="material-symbols-outlined">
              chat
            </span></li>
          </NavLink>
          <NavLink to="/myprofile">
            <li><span style={{color:"black"
              }} class="material-symbols-outlined">
              account_circle
            </span></li>
          </NavLink>
          <li onClick={logoutUser}>
            <span style={{color:"black"
              }} class="material-symbols-outlined">
              logout
            </span>
          </li>

        </>
      ];

    } else {
      return [
        <>
          <NavLink to="/home">
            <li>
              <span style={{color:"black"
              }} class="material-symbols-outlined">
                home
              </span>
            </li>
          </NavLink>
          <NavLink to="/register">
            <li>SignUp</li>
          </NavLink>
          <NavLink to="/login">
            <li>SignIn</li>
          </NavLink>
        </>
      ]
    }

  }

  return (
    <div className="navbar">
      <img id="insta-logo" className="logo" src={logo} alt="" style={{cursor:"pointer"}} onClick={()=>navigate("/home")}/>
      <ul className="nav-menu">{loginStatus()}</ul>
      <ul className="nav-mobile">{loginMobile()}</ul>
    </div>
  );

};

