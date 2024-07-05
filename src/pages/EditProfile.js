import React, { useState, useEffect, useRef } from "react";
import "../assets/css/about.css";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../Reducer/UseReducer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { EditProfileSchema } from "../components/Validations";
const EditProfile = () => {
  useEffect(()=>{
    document.title="Update Profile"  
    },[])
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
  const handleback = () => {
    navigate("/myprofile");
  };

  return (
    <>
      <div className="backpage" style={{display:"flex",margin:"20px"}}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          fill="#030303"
          className="backpage-icon"
          class="bi bi-arrow-left-circle-fill"
          viewBox="0 0 16 16"
          onClick={handleback}
        >
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
        </svg>

        <div className="Aboutpage">
          <div className="first-part">
            <div className="edit-sec" onClick={() => inputref.current.click()}>
            <div className="img-container">
    {formik.values.profileImage ? (
        typeof formik.values.profileImage === "object" ? (
            <img src={URL.createObjectURL(formik.values.profileImage)} alt="Selected Profile" />
        ) : (
            <img src={`http://localhost:5000/images/${formik.values.profileImage}`} alt="Profile" />
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


              <div className="edit-btn">
                <input
                  type="file"
                  className="edit-btn-profile"
                  name="btnaddmore"
                  style={{ display: "none" }}
                  ref={inputref}
                  onChange={handleImageChange}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="profilesection  emp-profile">
            <form
              className="section-about"
              method="GET"
              onSubmit={formik.handleSubmit}
            >
              


                <div className="col-md-6">
                  <input
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="name"
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <p className="err-msg-profile">{formik.errors.name}</p>
                )}
          

            

                <div className="col-md-6">
                  <input
                    className="about-input"
                    type="text"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="email"
                    readOnly
                  />
                </div>

              

                <div className="col-md-6">
                  <input
                    type="text"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="mobile"
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <p className="err-msg-profile">{formik.errors.mobile}</p>
                  )}
                </div>

              <div className="savebtn">
                <button className="btn-edit-profile" type="submit">
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

