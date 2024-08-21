import React, { useState, useEffect, useRef } from "react";
import "../assets/css/about.css";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../Reducer/UseReducer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { EditProfileSchema } from "../components/Validations";
const EditProfile = () => {
  useEffect(() => {
    document.title = "Update Profile"
  }, [])
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const inputref = useRef(null);
  const [img, setImg] = useState("");

  const formik = useFormik({
    initialValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      mobile: userData?.mobile || "",
      profileImage: userData?.profileImage || null,
    },
    validationSchema: EditProfileSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("mobile", values.mobile);

        if (values.profileImage) {
          formData.append("profileImage", values.profileImage);
        } else {
          formData.append("oldProfileImage", userData.profileImage);
        }
        const res = await fetch(
          `http://localhost:5000/user/update/${userData._id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
            },
            body: formData,

          }
        );

        const updatedata = await res.json();
        if (res.status === 400 || !updatedata) {
        } else {
          dispatch(setUserData(updatedata.user));
          Swal.fire({
            icon: "success",
            title: "Data Updated Successfully",
            text: "Your data has been updated successfully.",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn",
            },
          }).then(() => {
            navigate("/myprofile");
          });
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: userData?.name || "",
      email: userData?.email || "",
      mobile: userData?.mobile || "",
      profileImage: userData?.profileImage || null,
    });
  }, [userData]);



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("profileImage", file);
      setImg(file);
    }
  };


  return (
    <>
      <div className="backpage" style={{ display: "flex", margin: "20px" }}>

        <div className="Aboutpage">
          <div className="first-part">
            <div className="edit-sec" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="img-container">
                {formik.values.profileImage ? (
                  typeof formik.values.profileImage === "object" ? (
                    <img src={URL.createObjectURL(formik.values.profileImage)} alt="Selected Profile" />
                  ) : (
                    <img src={`http://localhost:5000/images/${formik.values.profileImage}`} alt="Profile" style={{ width: "140px", height: "140px", borderRadius: "50%" }} />
                  )
                ) : (
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgee_ioFQrKoyiV3tnY77MLsPeiD15SGydSQ&usqp=CAU"
                    width="53px"
                    height="53px"
                    alt="Default Profile"
                  />
                )}
              </div>


              <div className="edit-btn" onClick={() => inputref.current.click()}  >
                <input
                  type="file"
                  className="edit-btn-profile"
                  name="btnaddmore"
                  style={{ display: "none" }}
                  ref={inputref}
                  onChange={handleImageChange}
                />
                <button type="submit" className="btn btn-primary">Edit Profile Picture</button>

              </div>
            </div>
          </div>

          <div className="profilesection  emp-profile">
            <form
              // className="section-about"
              method="GET"
              onSubmit={formik.handleSubmit}
            >



              <div className="">
                <label for="exampleInputEmail1" className="form-label" style={{ fontSize: "14px", fontWeight: "600", margin: "0px", marginTop: "8px" }}>Name</label>
                <input
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="name"
                  className="form-control form-control-sm"
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="err-msg-login">{formik.errors.name}</p>
              )}




              <div className="">
                <label for="exampleInputPassword1" class="form-label" style={{ fontSize: "14px", fontWeight: "600", margin: "0px", marginTop: "8px" }}>Email Address</label>
                <input
                  className="form-control form-control-sm"
                  type="text"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="email"
                  readOnly
                />
              </div>



              <div class="">
                <label for="exampleInputPassword1" class="form-label" style={{ fontSize: "14px", fontWeight: "600", margin: "0px", marginTop: "8px" }}>Mobile</label>
                <input
                  type="text"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="mobile"
                  className="form-control form-control-sm"
                />

              </div>
              {formik.touched.mobile && formik.errors.mobile && (
                <p className="err-msg-login">{formik.errors.mobile}</p>
              )}
              <div className="savebtn" >
                <button className="btn btn-primary mt-2" type="submit" style={{ width: "100%" }}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditProfile;

