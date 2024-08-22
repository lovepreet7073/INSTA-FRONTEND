import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { resetPasswordSchema } from "./Validations";
const ResetPassword = () => {
  useEffect(() => {
    document.title = "Reset password"
  }, [])
  const [passwordVisibility, setPasswordVisibility] = useState({

    showNewPassword: false,
    showConfirmPassword: false,
  });

  const handleToggleVisibility = (field) => {
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  const { token } = useParams()
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/resetpassword/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
  
        const data = await response.json();
  
        if (response.ok && data.status === true) {
          Swal.fire({
            icon: "success",
            title: "Password reset Successfully!",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn",
            },
          }).then(() => {
            navigate("/login");
          });
        } else {
          if (data.error) {
            Swal.fire({
              icon: "error",
              title: "Invalid Token",
              text: "Please try again or request a new password reset link.",
              confirmButtonText: "OK",
              customClass: {
                confirmButton: "btn",
              },
            }).then(() => {
              navigate("/login");
            });
          } 
        }
      } catch (error) {
        console.error("Reset password error:", error);
        Swal.fire({
          icon: "error",
          title: "Password reset failed",
          text: "Something went wrong. Please try again later.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn",
          },
        });
      }
    },
  });
  



  return (
    <>
      <div className="signUp">
        <div className="form-container">
          <div className="form" style={{ width: "100%", padding: "30px" }} >


            <form onSubmit={formik.handleSubmit}>

              <h2 className="form-title">Reset Password</h2>




              <div className="input-control">
                <input
                  type={passwordVisibility.showNewPassword ? "text" : "password"}


                  id="exampleInputPassword1"
                  placeholder="New Password"
                  autoComplete="off"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="newPassword"
                />
                <span
                  onClick={() => handleToggleVisibility("showNewPassword")}
                  style={{ cursor: "pointer" }}
                >
                  {passwordVisibility.showNewPassword ? (
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
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="err-msg-password">{formik.errors.newPassword}</p>
              )}

              <div className="input-control">
                <input
                  type={passwordVisibility.showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span
                  onClick={() => handleToggleVisibility('showConfirmPassword')}
                  style={{ cursor: "pointer" }}
                >
                  {passwordVisibility.showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M23.8,11.478c-.13-.349-3.3-8.538-11.8-8.538S.326,11.129.2,11.478L0,12l.2.522c.13.349,3.3,8.538,11.8,8.538s11.674-8.189,11.8-8.538L24,12ZM12,18.085c-5.418,0-8.041-4.514-8.79-6.085C3.961,10.425,6.585,5.915,12,5.915S20.038,10.424,20.79,12C20.038,13.576,17.415,18.085,12,18.085Z" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M23.271,9.419A15.866,15.866,0,0,0,19.9,5.51l2.8-2.8a1,1,0,0,0-1.414-1.414L18.241,4.345A12.054,12.054,0,0,0,12,2.655C5.809,2.655,2.281,6.893.729,9.419a4.908,4.908,0,0,0,0,5.162A15.866,15.866,0,0,0,4.1,18.49l-2.8,2.8a1,1,0,1,0,1.414,1.414l3.052-3.052A12.054,12.054,0,0,0,12,21.345c6.191,0,9.719-4.238,11.271-6.764A4.908,4.908,0,0,0,23.271,9.419ZM2.433,13.534a2.918,2.918,0,0,1,0-3.068C3.767,8.3,6.782,4.655,12,4.655A10.1,10.1,0,0,1,16.766,5.82L14.753,7.833a4.992,4.992,0,0,0-6.92,6.92l-2.31,2.31A13.723,13.723,0,0,1,2.433,13.534ZM15,12a3,3,0,0,1-3,3,2.951,2.951,0,0,1-1.285-.3L14.7,10.715A2.951,2.951,0,0,1,15,12ZM9,12a3,3,0,0,1,3-3,2.951,2.951,0,0,1-1.285.3L9.3,13.285A2.951,2.951,0,0,1,9,12}Z" />
                    </svg>
                  )}
                </span>

              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="err-msg-password">{formik.errors.confirmPassword}</p>
              )}



              <button type="submit" className="btn-register">
                Reset
              </button>


            </form>
          </div>

        </div>
      </div>


    </>
  )
}

export default ResetPassword


