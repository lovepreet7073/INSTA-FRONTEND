import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

import "../assets/css/post.css";
import { useFormik } from "formik";
import { CreatePostSchema } from "../components/Validations";
import { addPost } from "../Reducer/postReducer";

const UpdatePost = ({ post }) => {
    useEffect(()=>{
        document.title="Update Post"  
        },[])
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef(null);
    
    const [loading, setLoading] = useState(true);
    const [postData, setPostData] = useState(null);

    const postId = location.state?.postId || "";

    useEffect(() => {
        async function fetchPostData() {
            try {
                const response = await fetch(`http://localhost:5000/user/editpost/${postId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPostData(data);
                    setLoading(false);
                } else {
                    console.error("Failed to fetch post data");
                }
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        }

        if (postId) {
            fetchPostData();
        }
    }, [postId]);

    const formik = useFormik({
        initialValues: {
            title: postData ? postData.title : "",
            description: postData ? postData.description : "",
            postImg: postData && postData.image ? postData.image.path : null,
        },
        validationSchema: CreatePostSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            // Prepare FormData for submission
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);

            if (typeof values.postImg === "object") {
                // If `postImg` is a file, append it to FormData
                formData.append("image", values.postImg);
            }

            try {
                const response = await fetch(`http://localhost:5000/user/updatepost/${postId}`, {
                    method: "POST",
                    body: formData,
                  headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
                });

                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Post Updated Successfully",
                        confirmButtonText: "OK",
                    }).then(async () => {
                        const responseData = await response.json();
                        dispatch(addPost(responseData.post));
                        navigate("/myprofile");
                    });
                } else {
                    console.error("Failed to update post");
                }
            } catch (error) {
                console.error("Error updating post:", error);
            }
        },
    });

    // Custom file change handler
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        formik.setFieldValue("postImg", file);
    };

    if (loading) {
        // Show a loading indicator while fetching data
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="postpage">
                <div className="heading-part-editpost mt-4">
                    <div className="profile-head-editpost">
                        <h2>Update Post</h2>
                    </div>
                </div>

                <form method="POST" onSubmit={formik.handleSubmit}>
                    <div className="edit-btn-post" onClick={() => inputRef.current.click()}>
                        <input
                            type="file"
                            className="edit-btn-profile"
                            name="btnaddmore"
                            style={{ display: "none" }}
                            ref={inputRef}
                            onChange={handleFileChange}
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
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </div>

                    <div className="image-part-edit-post">
                        {formik.values.postImg && typeof formik.values.postImg === "string" ? (
                            // Display existing image if it is a URL
                            <img src={formik.values.postImg} alt="Existing Post" />
                        ) : formik.values.postImg && typeof formik.values.postImg !== "string" ? (
                            // Display selected image if it is a file
                            <img src={URL.createObjectURL(formik.values.postImg)} alt="Selected Post" />
                        ) : null}
                    </div>

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
                        Save
                    </button>
                </form>
            </div>
        </>
    );
};

export default UpdatePost;
