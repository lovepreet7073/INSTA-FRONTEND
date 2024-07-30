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
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  useEffect(()=>{
    document.title="Create Post"  
    },[])



  const formik = useFormik({
    initialValues: {
      title: "",
      postImg: null,
    },   validationSchema: CreatePostSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
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

  return (
    <>
     <div className="backpage" style={{display:"flex",margin:"20px"}}>
       
        <div className="postpage-create">
          <div className="heading-part mt-4">
            <div className="profile-head-head">
              <h3>Create Post</h3>
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
                    style={{width:"370px",height:"310px"}}
                  />
                </div>
              ) : (
                <div
                style={{cursor:"pointer"}}
                  className="edit-sec-post"
                  onClick={() => inputRef.current.click()}
                >
               <i class="bi bi-image-fill size" style={{fontSize:"30px"}}></i>
                  <div className="edit-btn">
                    <input
                      type="file"
                      className="input-control"
                      name="postImg"SSS
                      style={{ display: "none" }}
                      ref={inputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                 
                </div>
              
              )}
            </div>
            {formik.touched.postImg && formik.errors.postImg && (
                  <p className="err-msg-login">{formik.errors.postImg}</p>
                )}
            <div className="setting">
              <div className="input-control mt-2">
                <input
                  type="text"
                  className="form-control form-control-sm" 
                  id="exampleInputTitle"
                  placeholder="Caption"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.title && formik.errors.title && (
                  <p className="err-msg-login">{formik.errors.title}</p>
                )}
           
              <button type="submit" className="btn btn-primary mt-3" style={{width:"100%"}}>
                Submit
              </button>
            </div>
          </form>
        </div>

      </div>
    </>
  );
};

export default CreatePost;
