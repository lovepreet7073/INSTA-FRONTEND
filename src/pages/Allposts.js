import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import '../assets/css/allposts.css';
import Reply from "../components/Reply";
import formatShortDate from "../functions/formatDate";
const AllPosts = () => {

  useEffect(() => {
    document.title = "All Posts";
  }, []);

  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [comment, setComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [item, setItem] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});
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
        console.log(newPosts, 'newPosts')
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



  const createComment = async (text, id) => {
    if (comment) {
      try {
        const response = await fetch(
          `http://localhost:5000/user/api/comment`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
            },
            body: JSON.stringify({
              text: text,
              postId: id,
            })
          }
        );
        const updatedPost = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === id ? updatedPost : post))
        );
        setComment("")
      } catch (error) {
        console.error("Error liking post:", error);
      }
    }
  }

  const replyComment = async (postId, commentId, replyText) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/api/comment/${commentId}/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
          body: JSON.stringify({
            reply: replyText,

          })
        }
      );
      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error("Error reply on comment:", error);
    }
  }

  const replyOnReply = async (postId, commentId, replytext, parentReplyId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/api/replyonComment/${commentId}/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
          body: JSON.stringify({
            replytext: replytext,
            parentReplyId: parentReplyId,

          })

        }
      );

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error("Error reply on comment:", error);
    }
  }

  const toggleComment = (post) => {
    setItem(post); // Set the selected post
    setShow(!show); // Toggle the show state
  }
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };


  const handleReply = (reply, commentId) => {
    setReplyingTo({
      ...reply,
      parentReplyId: reply._id,
      commentId: commentId
    });
    setComment(`@${reply.postedBy.name} `); // Optionally pre-fill with username
  };

  const handlereplyclick = (comment) => {
    setReplyingTo(comment)
    setComment(`@${comment.postedBy.name} `);
  }
  const handleCreateComment = () => {
    if (replyingTo) {
      if (replyingTo.parentReplyId) {
        replyOnReply(item._id, replyingTo.commentId, comment, replyingTo._id);
      } else {
        replyComment(item._id, replyingTo._id, comment)
      }
    } else {
      createComment(comment, item._id);
    }
    setComment("");
    setReplyingTo(null);
  };
  console.log(replyingTo, "to")
  console.log('item', item)
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
          endMessage={<span style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}><p style={{ textAlign: "center" }}>You're All Caught Up</p>
            <i class="bi bi-check-circle" style={{ fontSize: "49px", fontWeight: "800", color: "green" }}></i></span>}
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="div-card">
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
                    to={post.userId && post.userId._id === userData._id
                      ? `/myprofile` // Redirect to current user's profile
                      : `/userinfo/${post.userId ? post.userId._id : "#"}` // Redirect to user info page
                    }
                  >
                    <p className="name-of-user" style={{ margin: "0px" }}>
                      {post.userId ? post.userId.name : "Unknown User"}
                    </p>
                    <span style={{ fontSize: "11px", color: "#403131bf" }}>
                      {formatShortDate(post.createdAt)}
                    </span>
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
                  <span style={{ display: "flex", gap: "8px" }}>
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
                        fill=""
                      >
                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                      </svg>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" onClick={() => toggleComment(post)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-message-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" /></svg>

                  </span>
                  <p style={{ margin: "13px 0px 3px 1px" }}>
                    {post.likes} {post.likes > 1 ? 'likes' : 'like'}
                  </p>

                  <div className="des-title">
                    <p className="title">{truncateTitle(post.title, post._id)}</p>
                    {post.comments.length === 0 ? (
                      <p onClick={() => toggleComment(post)} style={{ cursor: "pointer", fontSize: "14px", color: "#a99d9dc2" }}
                      >No comments yet</p>
                    ) : (
                      <p
                        style={{ cursor: "pointer", fontSize: "14px", color: "#a99d9dc2" }}
                        onClick={() => toggleComment(post)}
                      >
                        View all {post.comments.length} comments
                      </p>
                    )}
                  </div>



                </div>


                <div className="add-comment">
                  <i class="bi bi-emoji-smile" style={{ fontSize: "20px" }}></i>
                  <input type='text' value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" required />
                  <button className="btn btn-primary-sm" style={{ color: "blue" }} onClick={() => createComment(comment, post._id)}>Post</button>
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
      {show && item && (
        <div className="show-comment" style={{ width: "100%" }}>
          <div className="container comment">
            <div className="post-pic">
              {item.image.filename && (
                <img
                  src={`http://localhost:5000/images/${item.image.filename}`} style={{ width: "100%", objectFit: "contain" }}></img>
              )}
            </div>
            <div className="details">
              <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                <div className="card-pic">
                  <img
                    src={`http://localhost:5000/images/${item.userId.profileImage}`}
                    alt=""
                    height="42px"
                    width="42px"
                    style={{ borderRadius: "100px" }}
                  />
                </div>
                <h5>{item.userId.name}</h5>
              </div>

              <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
                {item.comments.map((comment) => {
                  return (
                    <div className="comm">
                      <img src={`http://localhost:5000/images/${comment.postedBy.profileImage}`
                      }
                        style={{
                          width: "37px", height: "37px", borderRadius: "100px", objectFit: "cover"
                        }}></img>
                      <div className='upper-part' >
                        <span className="commenter" style={{ fontWeight: "bold", fontSize: "14px", display: "flex", gap: "4px" }}>{comment.postedBy.name}
                          <p style={{ fontSize: "11px", color: "#403131bf" }}>{formatShortDate(comment.createdAt)} </p></span>
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <p className="comment-text">{comment.comment}</p>
                          <button style={{ fontSize: "12px", color: "blue", marginTop: "-17px" }} className="btn btn-primary-sm" onClick={() => handlereplyclick(comment)}>Reply</button></span>
                        {comment.replies && comment.replies.map(reply => (
                          <Reply key={reply._id} reply={reply} handleReply={handleReply} commentId={comment._id} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              {replyingTo && (

                <div className="reply-box">

                  <img
                    src={`http://localhost:5000/images/${replyingTo.postedBy.profileImage}`}
                    style={{ width: "30px", height: "30px", borderRadius: "100px", objectFit: "cover" }}
                  ></img>
                  <p style={{ margin: "0px" }}>Replying to <strong>{replyingTo.postedBy.name}</strong></p>
                  <button onClick={() => {
                    setReplyingTo(null)
                    setComment("")
                  }}><i class="bi bi-x"></i></button>
                </div>
              )}

              <div className="add-comment">
                <i class="bi bi-emoji-smile" style={{ fontSize: "20px" }}></i>
                <input
                  type="text"
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder={replyingTo ? `${replyingTo.postedBy.name}` : "Add a comment"}
                  required
                />
                <button
                  className="btn btn-primary-sm"
                  style={{ color: "blue" }}
                  onClick={() => {
                    handleCreateComment()
                    toggleComment(item)
                  }}
                >
                  {replyingTo ? "Reply" : "Post"}
                </button>
              </div>

            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" onClick={toggleComment} style={{ position: "fixed", top: "4%", right: "10%", color: "white" }} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        </div>
      )}
    </div>
  );
};

export default AllPosts;
