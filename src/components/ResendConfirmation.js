import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup"; 
import logo from "../assets/images/instalogo.jpg";
import "../assets/css/forgotpass.css";

const ResendConfirmation = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/resend-confirmation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        });

        const data = await response.json(); // Parse response JSON

        setLoading(false);

        if (response.status === 404) {
          formik.setFieldError("email", data.message || "Email not registered.");
        } else if (response.status === 400) {
          formik.setFieldError("email", data.message || "Email already confirmed.");
        } else if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Email Sent",
            text: "Check your inbox for confirmation mail",
          }).then(() => {
            navigate("/login");
          });
        } else {
          formik.setFieldError("email", "An error occurred while sending the email.");
        }
      } catch (error) {
        setLoading(false);
        formik.setFieldError("email", "An error occurred while sending the email.");
        console.error("Error sending email:", error);
      }
    },
  });

  return (
    <div className="signIn">
      <div>
        <div className="login-form">
          <img className="signUp-logo" src={logo} alt="Logo" />
          <form onSubmit={formik.handleSubmit}>
            <div>
              <input
                type="email"
                className={`form-control ${formik.errors.email && formik.touched.email ? "is-invalid" : ""}`}
                placeholder="Enter Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
                name="email"
                style={{ padding: "7px" }}
              />
            </div>

            {formik.touched.email && formik.errors.email && (
              <p className="err-msg-register">{formik.errors.email}</p>
            )}

            <button
              id="clk"
              type="submit"
              className={`btn-login ${loading ? "disabled" : ""}`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResendConfirmation;
