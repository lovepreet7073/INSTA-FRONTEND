import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import '../assets/css/allposts.css';

const AllPosts = () => {
  useEffect(() => {
    document.title = "All Posts";
  }, []);

  const [posts, setPosts] = useState([]);
  console.log(posts.length,"posts")
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.user.userData);
  const postsPerPage = 7;

  const fetchPosts = async (id, page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/user/allposts/${id}?page=${page}&limit=${postsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
        }
      );
  
      if (response.ok) {
        const { posts: newPosts, hasMore } = await response.json();
        setTimeout(() => {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
          setHasMore(hasMore);
        }, 1500);
     
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching posts for page:", page);
    if (userData?._id) {
  fetchPosts(userData._id, page);
    }
  }, [userData, page]);

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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    if (query === "") {
      // setPage(1);
      setPosts([]);
      // setHasMore(true);
      fetchPosts(userData?._id, 1);
      return;
    }
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(query)
    );

    setError("");
    setPosts(filtered);
    if (filtered.length === 0) {
      setError("");
    } else {
      setError("");
    }
  };

console.log(posts.length,page,'check')
  return (
    <div className="home">
      <div className="card">
        {/* <input
          type="text"
          placeholder="Search posts..."
          onChange={handleSearch}
        /> */}
        <InfiniteScroll
          dataLength={posts.length}
          next={() => setPage((prevPage) => prevPage + 1)}
          hasMore={hasMore}
          loader={
            <div className="skeleton-wrapper">
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
          endMessage={<span style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}><p style={{ textAlign: "center" }}>You're All Caught Up</p>
        <i class="bi bi-check-circle" style={{fontSize:"49px",fontWeight:"800",color:"green"}}></i></span>}
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id}>
                <div className="card-header">
                  <div className="card-pic">
                    {post.userId && post.userId.profileImage ? (
                      <img
                        src={`http://localhost:5000/images/${post.userId.profileImage}`}
                        alt=""
                        height="35px"
                        width="35px"
                        style={{ borderRadius: "100px" }}
                      />
                    ) : (
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsRVqXpVCq4B_yBFj2bPKz_BWGfBriF5Huqw&s"
                        alt="image"
                      />
                    )}
                  </div>
                  <NavLink
                    className="info-user-content"
                    style={{ textDecoration: "none" }}
                    to={post.userId ? `/userinfo/${post.userId._id}` : "#"}
                  >
                    <p className="name-of-user" style={{ marginTop: "10px" }}>
                      {post.userId ? post.userId.name : "Unknown User"}
                    </p>
                  </NavLink>
                </div>
                <div className="card-image">
                  <img
                    className="post-img"
                    src={`http://localhost:5000/images/${post.image.filename}`}
                    alt="Post"
                  />
                </div>
                <div className="card-content">
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {post?.likedBy?.includes(userData?._id) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        onClick={() => {
                          likePost(post._id, userData?._id);
                        }}
                        width="24px"
                        fill="#EA3323"
                      >
                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        onClick={() => {
                          likePost(post._id, userData?._id);
                        }}
                        width="24px"
                        fill="#0000F5"
                      >
                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                      </svg>
                    )}
                    <p style={{ margin: "0px" }}>{post.likes}</p>
                  </span>
                  <span style={{ lineHeight: "16px" }}>
                    <h6 className="card-title">{post.title}</h6>
                    <p style={{ marginBottom: "5px" }} className="card-text">
                      {post.description}
                    </p>
                  </span>
                </div>
              </div>
            ))
          ) : (
            !loading && <p style={{ textAlign: "center", marginTop: "20px" }}>
              {error || ""}
            </p>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AllPosts;
