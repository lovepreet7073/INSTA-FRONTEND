import "../assets/css/userpost.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost, setSelectedPost } from "../Reducer/postReducer";
import Swal from "sweetalert2";
import { deletePost } from "../Reducer/postReducer";

const UserPost = ({ userId, setPostLength, postLength }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const loginUserId = userData?._id;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `http://localhost:5000/user/posts/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
              },
            }
          );
          if (response.ok) {
            const postData = await response.json();
            setPosts(postData);
            dispatch(addPost(postData));
          } else {
            console.error("Failed to fetch posts");
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };

    fetchPosts();
  }, [userId]);

  const likePost = async (postId, userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/likepost/${postId}/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
        }
      );
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? updatedPost : post))
        );
      } else {
        console.error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:5000/user/deletepost/${postId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
            },
          }
        );
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your post has been deleted.",
          }).then(() => {
            setPosts((prevPosts) =>
              prevPosts.filter((post) => post._id !== postId)
            );
            dispatch(deletePost(postId));
            setPostLength(postLength - 1);
          });
        } else {
          console.error("Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleUpdateLink = (post) => {
    dispatch(setSelectedPost(post));
    navigate("/updatepost", { state: { postId: post } });
  };

  return (
    <div>
      <div className="home">
        <div className="card">
          {posts.length === 0 ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",margin:"45px"}}>
            <p style={{color:"#111154",fontSize:"21px",fontWeight:"bold"}}>No posts yet!</p>
           <div className="circle">
<svg style={{marginTop:"14px",cursor:"auto"}} xmlns="http://www.w3.org/2000/svg" height="64px" viewBox="0 -960 960 960" width="64px" fill="#274483"><path d="M479.29-250q79.27 0 134.99-55.01Q670-360.03 670-439.29q0-79.27-55.49-134.99Q559.03-630 479.76-630q-79.26 0-134.51 55.49Q290-519.03 290-439.76q0 79.26 55.01 134.51Q400.03-250 479.29-250Zm.46-116Q448-366 427-387.05t-21-52.5q0-31.45 21.05-52.95 21.05-21.5 52.5-21.5t52.95 21.25q21.5 21.26 21.5 53Q554-408 532.75-387q-21.26 21-53 21ZM170-74q-57.12 0-96.56-39.44Q34-152.88 34-210v-460q0-57.13 39.44-96.56Q112.88-806 170-806h94l52-46q19-16 42.79-25t48.21-9h146q24.42 0 48.21 9T644-852l52 46h94q57.13 0 96.56 39.44Q926-727.13 926-670v460q0 57.12-39.44 96.56Q847.13-74 790-74H170Zm0-136h620v-460H642l-87-80H408l-92 80H170v460Zm310-230Z"/></svg>
            </div>
            </div>
          ) : (
            posts.map((post, index) => (
              <div key={index} className="ww">
                <div className="card-image">
                  {post.image && (
                    <img
                      src={`http://localhost:5000/${post.image.path}`}
                      alt="Post"
                      className="profile-post-img"
                    />
                  )}
                </div>
                <div className="card-content">
                  <div className="set-icons">
                    <span>
                      {post?.likedBy?.includes(loginUserId) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            likePost(post._id, loginUserId);
                          }}
                          width="24px"
                          fill="#EA3323"
                        >
                          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ cursor: "pointer" }}
                          height="24px"
                          viewBox="0 -960 960 960"
                          onClick={() => {
                            likePost(post._id, loginUserId);
                          }}
                          width="24px"
                          fill="#0000F5"
                        >
                          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                        </svg>
                      )}
                    </span>
                    <div className="set-btns">
                      {loginUserId === post.userId._id && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => handleUpdateLink(post._id)}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2d39e6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="icon icon-tabler icons-tabler-outline icon-tabler-edit"
                          >
                            <path
                              stroke="none"
                              d="M0 0h24v24H0z"
                              fill="none"
                            />
                            <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                            <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                            <path d="M16 5l3 3" />
                          </svg>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => handleDelete(post._id)}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ed0c0c"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 7l16 0" />
                            <path d="M10 11l0 6" />
                            <path d="M14 11l0 6" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                          </svg>
                        </>
                      )}
                    </div>
                  </div>
                  <p>{post.likes} Likes</p>
                  <p className="post-title">
                    <strong>TITLE:</strong>
                    {post.title}
                  </p>
                  <p className="post-des">
                    <strong>DESCRIPTION:</strong>
                    {post.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPost;
