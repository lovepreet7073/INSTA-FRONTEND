import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import '../assets/css/allposts.css'

const AllPosts = () => {
  useEffect(() => {
    document.title = "All Posts";
  }, []);

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userData = useSelector((state) => state.user.userData);
  const postsPerPage = 3;

  const fetchPosts = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/allposts/${id}`,
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
        setLoading(false);
        setError("");
        setPosts(postData);
        if (postData.length === 0) {
          setError("No posts found");
        }
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchPosts(userData._id);
    }
  }, [userData]);

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
      fetchPosts(userData?._id);
      return;
    }
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(query)
    );

    setError("");
    setPosts(filtered);
    setCurrentPage(1);
    if (filtered.length === 0) {
      setError("No posts found");
    } else {
      setError("");
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (data) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <div className="header">
      <div className="home">
        <div className="card">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <div className="ww" key={post._id}>
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
                    to={post.userId ? `/userinfo/${post.userId._id}` : "#"}
                  >
                    <h3 className="name-of-user">
                      {post.userId ? post.userId.name : "Unknown User"}
                    </h3>
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
                  <span>
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
                    <p>{post.likes} Likes</p>
                  </span>
                  <span>
                    <p className="post-title">
                      <strong>Title:</strong> {post.title}
                    </p>
                    <p className="post-des">
                      <strong>Description:</strong> {post.description}
                    </p>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              {error || "No posts found"}
            </p>
          )}
          {/* Pagination */}
      
        </div>
        {currentPosts.length > 0 && (
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              pageCount={Math.ceil(posts.length / postsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              activeClassName={"active-page"}
            />
          )}
      </div>
    </div>
  );
};

export default AllPosts;

