import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../Reducer/postReducer";
import Swal from "sweetalert2";
import "../assets/css/createpost.css";
import { useFormik } from "formik";

import { useNavigate } from "react-router-dom";
import { CreatePostSchema } from "../components/Validations";
const CreatePost = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  useEffect(()=>{
    document.title="Create Post"  
    },[])
  const userData = useSelector((state) => state.user.userData);

  const dispatch = useDispatch();



  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      postImg: null,
    },   validationSchema: CreatePostSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("image", values.postImg);
  
      try {
        const response = await fetch(
          `http://localhost:5000/user/createpost/${userData._id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
            },
            body: formData,
            
          }
        );
  
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Post created Successfully",
  
            confirmButtonText: "OK",
          }).then(async () => {
           
  
            const responseData = await response.json();
  
            dispatch(addPost(responseData.post));
            navigate("/myprofile");
          });
        } else {
          console.error("Failed to create post");
        }
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  })
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("postImg", file); // Set file to formik state
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
        <div className="postpage">
          <div className="heading-part mt-4">
            <div className="profile-head-head">
              <h2>Create Post</h2>
            </div>
          </div>
          <form onSubmit={formik.handleSubmit} method="POST">
            <div className="image-part">
              {formik.values.postImg ? (
                <div className="img-container-postimg">
                  <img
                    src={URL.createObjectURL(formik.values.postImg)}
                    alt="Selected"
                    className="selected-image"
                    style={{width:"100%"}}
                  />
                </div>
              ) : (
                <div
                  className="edit-sec-post"
                  onClick={() => inputRef.current.click()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-photo-plus"
                    width="76"
                    height="76"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="#597e8d"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 8h.01" />
                    <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" />
                    <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" />
                    <path d="M14 14l1 -1c.67 -.644 1.45 -.824 2.182 -.54" />
                    <path d="M16 19h6" />
                    <path d="M19 16v6" />
                  </svg>
                  <div className="edit-btn">
                    <input
                      type="file"
                      className="edit-btn-profile"
                      name="postImg"
                      style={{ display: "none" }}
                      ref={inputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                 
                </div>
              
              )}
            </div>
            {formik.touched.postImg && formik.errors.postImg && (
                  <p className="err-msg">{formik.errors.postImg}</p>
                )}
            <div className="setting">
              <div className="form-group input-svg">
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputTitle"
                  placeholder="Title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.title && formik.errors.title && (
                  <p className="err-msg">{formik.errors.title}</p>
                )}
              <div className="form-group input-svg">
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputDescription"
                  placeholder="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.description && formik.errors.description && (
                  <p className="err-msg">{formik.errors.description}</p>
                )}
              <button type="submit" className="btn-createpost">
                Submit Post
              </button>
            </div>
          </form>
        </div>

      </div>
    </>
  );
};

export default CreatePost;
