import "../assets/css/userpost.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost, setSelectedPost, deletePost } from "../Reducer/postReducer";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import 'react-loading-skeleton/dist/skeleton.css';
import moment from 'moment';

const UserPost = ({ userId, setPostLength, postLength, isFollow }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 4;
  const [loading, setLoading] = useState(true); 
  const [initialLoad, setInitialLoad] = useState(true); // New state for initial load
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
            `http://localhost:5000/user/posts/${userId}?page=${page}&limit=${postsPerPage}`,
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
            setPosts((prevPosts) => [...prevPosts, ...postData]);
            setHasMore(postData.length === postsPerPage);
            dispatch(addPost(postData));
          } else {
            console.error("Failed to fetch posts");
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
          setInitialLoad(false); // Update initial load state
        }
      }
    };

    fetchPosts();
  }, [userId, page]);

  const fetchMorePosts = () => {
    setPage((prevPage) => prevPage + 1);
  };

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
            // Show skeleton loader while loading posts
            <div className="skeleton-wrapper" style={{ textAlign: "left" }}>
              {Array.from({ length: postsPerPage }).map((_, index) => (
                <div key={index} className="skeleton-card">
                  <Skeleton height={35} width={35} circle={true} />
                  <Skeleton height={20} width={`80%`} style={{ marginTop: "10px" }} />
                  <Skeleton height={200} width={`100%`} />
                  <Skeleton height={20} width={`60%`} style={{ marginTop: "10px" }} />
                  <Skeleton height={20} width={`100%`} />
                </div>
              ))}
            </div>
          ) : posts.length === 0 && !initialLoad ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>No posts yet.</p>
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchMorePosts}
              hasMore={hasMore}
              loader={
                <div className="skeleton-wrapper" style={{ textAlign: "left" }}>
                  {Array.from({ length: postsPerPage }).map((_, index) => (
                    <div key={index} className="skeleton-card">
                      <Skeleton height={35} width={35} circle={true} />
                      <Skeleton height={20} width={`80%`} style={{ marginTop: "10px" }} />
                      <Skeleton height={200} width={`100%`} />
                      <Skeleton height={20} width={`60%`} style={{ marginTop: "10px" }} />
                      <Skeleton height={20} width={`100%`} />
                    </div>
                  ))}
                </div>
              }
              endMessage={
                <span style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <p style={{ textAlign: "center" }}>You're All Caught Up</p>
                  <i className="bi bi-check-circle" style={{ fontSize: "49px", fontWeight: "800", color: "green" }}></i>
                </span>
              }
            >
              {posts.map((post, index) => (
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
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        {post?.likedBy?.includes(loginUserId) ? (
                          <i
                            className="bi bi-heart-fill"
                            onClick={() => likePost(post._id, loginUserId)}
                            style={{ color: "red", cursor: "pointer", fontSize: "20px", fontWeight: "800" }}
                          ></i>
                        ) : (
                          <i
                            className="bi bi-heart"
                            onClick={() => likePost(post._id, loginUserId)}
                            style={{ cursor: "pointer", fontSize: "20px" }}
                          ></i>
                        )}
                        <p style={{ margin: "0px" }}>{post.likes}</p>
                      </span>
                      <div className="set-btns">
                        {loginUserId === post.userId._id && (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => handleUpdateLink(post._id)}
                              style={{ marginRight: "15px" }}
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
                      <span style={{ fontSize: "11px", color: "#403131bf" }}>{formatShortDate(post.createdAt)} </span>
                      <p className="post-title" style={{ marginTop: "6px" }}>{post.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPost;
