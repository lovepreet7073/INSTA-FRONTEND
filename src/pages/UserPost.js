import "../assets/css/userpost.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost, setSelectedPost } from "../Reducer/postReducer";
import Swal from "sweetalert2";
import { deletePost } from "../Reducer/postReducer";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import moment from 'moment';
const UserPost = ({ userId, setPostLength, postLength ,isFollow}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const loginUserId = userData?._id;
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPosts = async () => {
      if (userId) {
        setLoading(true); 
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
        }finally{
          setLoading(false)
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
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
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

  const formatShortDate = (date) => {
    if (!date) {
      return "weeks ago";
    }
    const now = moment();
    const duration = moment.duration(now.diff(moment(date)));

    if (duration.asSeconds() < 60) {
      return `${Math.floor(duration.asSeconds())}s`; 
    } else if (duration.asMinutes() < 60) {
      return `${Math.floor(duration.asMinutes())}m`;
    } else if (duration.asHours() < 24) {
      return `${Math.floor(duration.asHours())}h`; 
    } else if (duration.asDays() < 7) {
      return `${Math.floor(duration.asDays())}d`;
    } else if (duration.asDays() < 30) {
      return `${Math.floor(duration.asDays() / 7)}w`;
    } else if (duration.asDays() < 365) {
      return `${Math.floor(duration.asDays() / 30)}m`; 
    } else {
      return `${Math.floor(duration.asDays() / 365)}y`; 
    }
  };
  return (
    <div>
    <div className="home">
      <div className="card">
        {loading ? (
            <div className="skeleton-wrapper" style={{textAlign:"left"}}>
          
              <div  className="skeleton-card">
                <Skeleton height={35} width={35} circle={true} />
                <Skeleton height={20} width={`80%`} style={{ marginTop: "10px" }} />
                <Skeleton height={200} width={`100%`} />
                <Skeleton height={20} width={`60%`} style={{ marginTop: "10px" }} />
                <Skeleton height={20} width={`100%`} />
              </div>
           
          </div>
        ) : posts.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "45px" }}>
            <p style={{ color: "#111154", fontSize: "21px", fontWeight: "bold" }}>No posts yet!</p>
            <div className="circle">
              <svg style={{ marginTop: "14px", cursor: "auto" }} xmlns="http://www.w3.org/2000/svg" height="64px" viewBox="0 -960 960 960" width="64px" fill="#274483">
                <path d="M479.29-250q79.27 0 134.99-55.01Q670-360.03 670-439.29q0-79.27-55.49-134.99Q559.03-630 479.76-630q-79.26 0-134.51 55.49Q290-519.03 290-439.76q0 79.26 55.01 134.51Q400.03-250 479.29-250Zm.46-116Q448-366 427-387.05t-21-52.5q0-31.45 21.05-52.95 21.05-21.5 52.5-21.5t52.95 21.25q21.5 21.26 21.5 53Q554-408 532.75-387q-21.26 21-53 21ZM170-74q-57.12 0-96.56-39.44Q34-152.88 34-210v-460q0-57.13 39.44-96.56Q112.88-806 170-806h94l52-46q19-16 42.79-25t48.21-9h146q24.42 0 48.21 9T644-852l52 46h94q57.13 0 96.56 39.44Q926-727.13 926-670v460q0 57.12-39.44 96.56Q847.13-74 790-74H170Zm0-136h620v-460H642l-87-80H408l-92 80H170v460Zm310-230Z"/>
              </svg>
            </div>
          </div>
        ) : (
          posts.map((post, index) => (
            <div className="card-image div-card" key={index}>
              {post.image && (
                <img
                  src={`http://localhost:5000/${post.image.path}`}
                  alt="Post"
                  className="profile-post-img"
                />
              )}
              <div className="card-content">
                <div className="set-icons">
                <span style={{ display: "flex", alignItems: "center",gap:"5px" }}>
                    {post?.likedBy?.includes(loginUserId) ? (
               
                      <i class="bi bi-heart-fill" onClick={() => {
                        likePost(post._id, loginUserId);
                      }} style={{color:"red",cursor:"pointer",fontSize:"20px",fontWeight:"800"}}></i>
                      
                    ) : (
                      <i class="bi bi-heart"  onClick={() => {
                        likePost(post._id, loginUserId);
                      }} style={{cursor:"pointer",fontSize:"20px"}}></i>
                     
                    )}
                    <p style={{ margin: "0px" }}>{post.likes} </p>
                  </span>
                  <div className="set-btns">
                    {loginUserId === post.userId._id && (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => handleUpdateLink(post._id)}
                          style={{marginRight:"15px"}}
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
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
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
                <div className="des-title">
                <span style={{ fontSize: "11px", color: "#403131bf" }}>{formatShortDate(post.createdAt)} ago</span>

                  <p className="post-title" style={{marginTop:"6px"}}
                  >{post.title}</p>
                </div>
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
