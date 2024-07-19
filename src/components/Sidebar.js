import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logo from "../assets/images/instalogo.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../Reducer/UseReducer';
import Swal from "sweetalert2";
const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
    return (
        <div className='sidebar d-flex flex-column justify-content-space-between text-white p-4 ' style={{ width: "250px" }}>
            <a className='text-decoration-none text-black d-flex align-items-center'>
                <img id="insta-logo" className="logo" src={logo} alt="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/allposts")} />
            </a>
            <ul className='nav nav-pills flex-column mt-3'>
                <li className='nav-item py-1'>
                    <NavLink to='/allposts' className='nav-link text-black fs-5' aria-current="page">
                        <i className="bi bi-house-door-fill"></i>
                        <span className='fs-5 ps-3'>Home</span>
                    </NavLink>
                </li>
                <li className='nav-item py-1'>
                    <NavLink to='/allusers' className='nav-link text-black fs-5' aria-current="page">
                        <i className="bi bi-search"></i>
                        <span className='fs-5 ps-3'>Search</span>
                    </NavLink>
                </li>
                <li className='nav-item py-1'>
                    <NavLink to='/chatpage' className='nav-link text-black fs-5' aria-current="page">
                    <i class="bi bi-send"></i>
                        <span className='fs-5 ps-3'>Messages</span>
                    </NavLink>
                </li>
                <li className='nav-item py-1'>
                    <NavLink to='/createpost' className='nav-link text-black fs-5' aria-current="page">
                    <i class="bi bi-plus-square"></i>
                        <span className='fs-5 ps-3'>Create</span>
                    </NavLink>
                </li>
                <li className='nav-item py-1'>
                    <NavLink to='/myprofile' className='nav-link text-black fs-5' aria-current="page">
                        <i className="bi bi-person-circle"></i>
                        <span className='fs-5 ps-3'>Profile</span>
                    </NavLink>
                </li>
                <li onClick={logoutUser} className='nav-item py-1'>
                <a  className='nav-link text-black fs-5' style={{ cursor: 'pointer' }}>
                    <i className="bi bi-box-arrow-right"></i>
                    <span className='fs-5 ps-3'>Logout</span>
                </a>
                </li>
                
                
            </ul>
            
        </div>
    );
};

export default Sidebar;
