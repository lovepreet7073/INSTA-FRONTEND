import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../Reducer/UseReducer";
import { useFormik } from "formik";
import { LoginSchema } from "../components/Validations";
import logo from "../assets/images/instalogo.jpg";
import Swal from "sweetalert2";
import "../assets/css/login.css"
const Login = () => {
  useEffect(()=>{
    document.title="Login"  
    },[])
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


 
  const formik = useFormik({
    initialValues: {
  
      email: "",
      password: "",

    },
    validationSchema:LoginSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const res = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await res.json();
        setLoading(false)
        if (res.status === 500 || data.error === "Login error!") {
          formik.setStatus("Invalid Credentials");
        } else if (res.status === 400 && data.message === "An Email sent to your account please verify!") {
          // Handle account verification needed
          Swal.fire({
            title: 'Account Verification Required',
            text: 'Please verify your account by checking your email.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }else if (res.ok && data.token) {
          // Successful login
          dispatch({ type: "User", payload: true });
          localStorage.setItem("jwttoken", data.token);
          dispatch(setUserData(data.user));
          navigate("/myprofile");
        } else {
          // Handle other response statuses
          formik.setStatus(data.error || "An unknown error occurred");
        }
      } catch (error) {
        console.error("Login error:", error);
        formik.setStatus("An error occurred during login");
      }
    }
  });

    



  const handleToggle = (showPassword) => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <div className="signIn">
        <div className="login-section">
          <div className="login-form">
         <img className = "signUp-logo"src={logo} alt=""/>

              <form onSubmit={formik.handleSubmit} method="POST">
              {formik.status && (
                                <p className="err-msg-login">{formik.status}</p>
                            )}
          <div className="input-control">
                  <input
                    type="email"
                    className="form-control form-control-sm" 
                    id="exampleInputEmail1"
                    placeholder="Email Address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="off"
                    name="email"
                  />
                </div>
                 {formik.touched.email && formik.errors.email && (
                  <p className="err-msg-login">{formik.errors.email}</p>
                )}
       <div className="input-control">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-sm" 
                    id="exampleInputPassword1"
                    placeholder="Password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span onClick={() => handleToggle(showPassword)}>
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M23.8,11.478c-.13-.349-3.3-8.538-11.8-8.538S.326,11.129.2,11.478L0,12l.2.522c.13.349,3.3,8.538,11.8,8.538s11.674-8.189,11.8-8.538L24,12ZM12,18.085c-5.418,0-8.041-4.514-8.79-6.085C3.961,10.425,6.585,5.915,12,5.915S20.038,10.424,20.79,12C20.038,13.576,17.415,18.085,12,18.085Z" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M23.271,9.419A15.866,15.866,0,0,0,19.9,5.51l2.8-2.8a1,1,0,0,0-1.414-1.414L18.241,4.345A12.054,12.054,0,0,0,12,2.655C5.809,2.655,2.281,6.893.729,9.419a4.908,4.908,0,0,0,0,5.162A15.866,15.866,0,0,0,4.1,18.49l-2.8,2.8a1,1,0,1,0,1.414,1.414l3.052-3.052A12.054,12.054,0,0,0,12,21.345c6.191,0,9.719-4.238,11.271-6.764A4.908,4.908,0,0,0,23.271,9.419ZM2.433,13.534a2.918,2.918,0,0,1,0-3.068C3.767,8.3,6.782,4.655,12,4.655A10.1,10.1,0,0,1,16.766,5.82L14.753,7.833a4.992,4.992,0,0,0-6.92,6.92l-2.31,2.31A13.723,13.723,0,0,1,2.433,13.534ZM15,12a3,3,0,0,1-3,3,2.951,2.951,0,0,1-1.285-.3L14.7,10.715A2.951,2.951,0,0,1,15,12ZM9,12a3,3,0,0,1,3-3,2.951,2.951,0,0,1,1.285.3L9.3,13.285A2.951,2.951,0,0,1,9,12Zm12.567,1.534C20.233,15.7,17.218,19.345,12,19.345A10.1,10.1,0,0,1,7.234,18.18l2.013-2.013a4.992,4.992,0,0,0,6.92-6.92l2.31-2.31a13.723,13.723,0,0,1,3.09,3.529A2.918,2.918,0,0,1,21.567,13.534Z" />
                      </svg>
                    )}
                  </span>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="err-msg-login">{formik.errors.password}</p>
                )}
           <button
                id="clk"
                type="submit"
                className={`btn-login btn btn-primary${loading ? "disabled" : ""}`}
                disabled={loading}
              >
                {loading ? "loading.." : "Log In"}
              </button>
                 <NavLink to ="/forgotpassword" className="forgot-pass">Forgot Password? </NavLink>
              </form>
            </div>

            <div className="loginForm2">
      
              
              Don't have an account?
              <span style={{color:"blue",cursor:"pointer"}}>
              <NavLink to="/register" className="login-link">
                SignUp
              </NavLink>
     
          </span>

            </div>
          </div>
        </div>
   
    </>
  );
};

export default Login;
