import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../assets/css/register.css";
import { useFormik } from "formik";
import logo from "../assets/images/instalogo.jpg";
import { GoogleLogin } from '@react-oauth/google';
import { RegisterSchema } from "../components/Validations";
import { setUserData } from "../Reducer/UseReducer";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
const Register = () => {

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = "Register"
  }, [])
  const [visibility, setVisibility] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const handleToggleVisibility = (field) => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        setLoading(false);
        if (response.status === 433) {
          formik.setFieldError("email", "Email already exists");
        }
        if (response.status === 201) {
          Swal.fire({
            title: 'Registration Successful!',
            text: 'Check your inbox for verification of your email.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(()=>navigate("/login")
          )
        }
      } catch (error) {
        setLoading(false);
        console.error("Error during registration:", error);
        // Swal.fire("Error", "An error occurred", "error");
      }
    }
  })


  const continueWithGoogle = (credentialResponse) => {
    console.log(credentialResponse);
    const jwtDetail = jwtDecode(credentialResponse.credential);
    console.log(jwtDetail.email_verified,"verufy");

    fetch("http://localhost:5000/googleLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: jwtDetail.name,
        email: jwtDetail.email,
        email_verified: jwtDetail.email_verified,
        clientId: credentialResponse.clientId,
        profileImage: jwtDetail.picture
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          console.log(data);
          localStorage.setItem("jwttoken", data.token);
          dispatch(setUserData(data.user));

          // Show success popup
          Swal.fire({
            title: 'Login Successful!',
            text: 'You have successfully logged in.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/myprofile"); // Redirect to profile page after the popup
            }
          });
        }
      })
      .catch(err => {
        console.error('Error during login:', err);
      });
  };




  //
  return (
    <>
      <div className="signUp">
        <div className="form-container">
          <div className="form">
            <img className="signUp-logo" src={logo} alt="" />
            <p className="loginPara">
              Sign up to see photos and videos <br /> from your friends
            </p>
            {msg && <div className="sucess-message">{msg}</div>}
            {/* <h2 className="form-title">Sign Up</h2> */}

            <form onSubmit={formik.handleSubmit}>
              <div className="input-control">
                <input
                  type="text"
                 className="form-control form-control-sm" 
                  id="exampleInputname"
                  autoComplete="off"
                  placeholder="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="name"
                />
                
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="err-msg-register">{formik.errors.name}</p>
              )}

              <div className="input-control">
                <input
                  type="email"
                  className="form-control form-control-sm" 
                  id="exampleInputEmail1"
                  autoComplete="off"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Email Address"
                  name="email"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="err-msg-register">{formik.errors.email}</p>
              )}

              <div className="input-control">
                <input
                  type="text"
                  className="form-control form-control-sm" 
                  id="exampleInputmobile"
                  autoComplete="off"
                  placeholder="Mobile Number"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="mobile"
                />
              </div>
              {formik.touched.mobile && formik.errors.mobile && (
                <p className="err-msg-register">{formik.errors.mobile}</p>
              )}

              <div className="input-control">
                <input
                  type={visibility.showPassword ? "text" : "password"}
                  className="form-control form-control-sm" 
                  id="exampleInputPassword1"
                  placeholder="Password"
                  autoComplete="off"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="password"
                />
                <span
                  onClick={() => handleToggleVisibility("showPassword")}
                  style={{ cursor: "pointer" }}
                >
                  {visibility.showPassword ? (
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
                <p className="err-msg-register">{formik.errors.password}</p>
              )}

              <div className="input-control">
                <input
                  type={visibility.showConfirmPassword ? "text" : "password"}
                  className="form-control form-control-sm" 
                  id="exampleInputconfirm"
                  placeholder="Confirm Password"
                  autoComplete="off"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="confirmPassword"
                />

                <span
                  onClick={() => handleToggleVisibility("showConfirmPassword")}
                  style={{ cursor: "pointer" }}
                >
                  {visibility.showConfirmPassword ? (
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
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="err-msg-register">{formik.errors.confirmPassword}</p>
                )}
              <p
                className="loginPara"
                style={{ fontSize: "12px", margin: "3px 0px" }}
              >
                By Signing up,you agree to out Terms, <br /> privacy policy and
                cookies policy.
              </p>

              <button
                id="clk"
                type="submit"
                className={`btn-register  btn btn-primary${loading ? "disabled" : ""}`}
                disabled={loading}
              >
                {loading ? "loading.." : "Sign Up"}
              </button>
              <hr style={{ width: "100%" }} />
              <GoogleLogin
                onSuccess={credentialResponse => {
                  continueWithGoogle(credentialResponse)
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />

            </form>
          </div>
          <div className="form2">
            Already have an Account?
            <span style={{ color: "blue", cursor: "pointer", textDecoration: "none" }}>

              <NavLink to="/login" className="login-link">
                Log in
              </NavLink>

            </span>

          </div>
  
        </div>
      </div>
    </>
  );
};

export default Register;
