import "../assets/css/userpost.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPost, setSelectedPost, deletePost } from "../reducer/postReducer";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import 'react-loading-skeleton/dist/skeleton.css';
import formatShortDate from "../functions/formatDate"

const UserPost = ({ userId, setPostLength, postLength, isFollow }) => {
  const [posts, setPosts] = useState([]);
  console.log(posts, "posts")
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});

  const postsPerPage = 4;
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // New state for initial load
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const loginUserId = userData?._id;
  const dispatch = useDispatch();
  console.log(hasMore,'wwwwwwwwwwww')
  const fetchPosts = async () => {
    if (userId && hasMore) {
      setLoading(true);
      try {
        console.log(`Fetching posts for userId: ${userId}, page: ${page}, limit: ${postsPerPage}`);

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/user/posts/${userId}?page=${page}&limit=${postsPerPage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
            },
          }
        );
        if (response.ok) {


          const { posts: newPosts, hasMore:hasMorePost } = await response.json();
          console.log(newPosts,hasMore,'has-more')
       
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            setHasMore(hasMorePost);
       

          // dispatch(addPost(postData));
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

  useEffect(() => {
   if(userId && hasMore){
    fetchPosts();
   }
  }, [userId, page,hasMore]);

  const fetchMorePosts = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };


  const likePost = async (postId, userId) => {
    try {
      const response = await fetch(
        `http://localh${process.env.REACT_APP_API_BASE_URL}/user/likepost/${postId}/${userId}`,
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
          `${process.env.REACT_APP_API_BASE_URL}/user/deletepost/${postId}`,
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

  const truncateTitle = (title, postId) => {
    const isExpanded = expandedPosts[postId];
    const limit = 30; // Adjust the character limit as needed
    if (isExpanded) {
      return (
        <>
          {title}
          <span
            onClick={() => toggleExpand(postId)}
            style={{ color: "blue", cursor: "pointer", fontSize: "12px" }}
          >
            show less
          </span>
        </>
      );
    } else if (title.length > limit) {
      return (
        <>
          {title.substring(0, limit)}...
          <span
            onClick={() => toggleExpand(postId)}
            style={{ color: "blue", cursor: "pointer", fontSize: "12px" }}
          >
            more
          </span>
        </>
      );
    } else {
      return title;
    }
  };

  const toggleExpand = (postId) => {
    setExpandedPosts((prevExpandedPosts) => ({
      ...prevExpandedPosts,
      [postId]: !prevExpandedPosts[postId],
    }));
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
                      src={`${process.env.REACT_APP_API_BASE_URL}/images/${post.image}`}
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
                      <div className="set-btns" style={{ display: "flex", gap: "12px" }}>
                        {loginUserId === post.userId._id && (
                          <>
                            <i class="bi bi-pen-fill" onClick={() => handleUpdateLink(post._id)} style={{ cursor: "pointer", fontSize: "20px" }}></i>

                            <i class="bi bi-trash3-fill" onClick={() => handleDelete(post._id)} style={{ cursor: "pointer", fontSize: "20px" }}></i>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="des-title">
                      <span style={{ fontSize: "11px", color: "#403131bf" }}>{formatShortDate(post.createdAt)} </span>
                      <p className="title">{truncateTitle(post.title, post._id)}</p>
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
