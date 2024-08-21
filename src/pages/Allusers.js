import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "../assets/css/allusers.css";

const Allusers = () => {
  useEffect(() => {
    document.title = "All Users";
  }, []);

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const userData = useSelector((state) => state.user.userData);
  const loginUserId = userData?._id;

  const followUser = async (userId, loginUserId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/follow/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
          body: JSON.stringify({
            loginUserId: loginUserId,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const filteredUsers = data.users.filter(
            (user) => user._id !== loginUserId
          );
          setUsers(filteredUsers);
        }
      } else {
        console.error("Failed to follow user");
      }
    } catch (error) {
      console.error("An error occurred while trying to follow the user", error);
    }
  };

  const unfollowUser = async (userId, loginUserId) => {
    if (userId) {
      try {
        const response = await fetch(
          `http://localhost:5000/user/unfollow/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
            },
            body: JSON.stringify({
              loginUserId: loginUserId,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const filteredUsers = data.users.filter(
              (user) => user._id !== loginUserId
            );
            setUsers(filteredUsers);
          }
        } else {
          console.error("Failed to unfollow user");
        }
      } catch (error) {
        console.error(
          "An error occurred while trying to unfollow the user",
          error
        );
      }
    }
  };

  const fetchUsers = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(`http://localhost:5000/user/allusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const filteredUsers = userData.filter(
          (user) => user._id !== loginUserId
        );
        setUsers(filteredUsers);
        setLoading(false); // Set loading to false once data is fetched
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [loginUserId]);

 

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    if (query === "") {
      fetchUsers();
      return;
    }
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(query)
    );

    setUsers(filtered);
    if (filtered.length === 0) {
      setError("No user found!❌");
    }
  };

  return (
    <div>
      <h3 className="allusers-head"></h3>

      <div className="section-allusers">
        <div className="search-bar">
          <i className="bi bi-search"></i>
          <input
            className="form-control form-control-sm"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={handleSearch}
            style={{ background: "none", border: "none" }}
          />
        </div>

        {loading ? (
          // Skeleton loader while loading
          <div className="user-list">
            {[...Array(users.length)].map((_, index) => (
              <div key={index} className="user-part">
                <div className="img-name">
                  <Skeleton circle={true} height={53} width={53} />
                  <Skeleton height={20} width={100} />
                </div>
                <div className="btn-sec">
                  <Skeleton height={30} width={80} />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="err-msg">{error}</div>
        ) : (
          <div className="user-list">
            {users.map((user) => (
              <div key={user._id} className="user-part">
                <div className="img-name">
                  <div className="imgg">
                    {user.profileImage ? (
                      <img
                        src={`http://localhost:5000/images/${user.profileImage}`}
                        // alt={`${user.name}'s profile`}
                        width="53px"
                        height="53px"
                        style={{objectFit:"cover"}}
                      />
                    ) : (
                      <img
                        src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-image-gray-blank-silhouette-vector-illustration-305504015.jpg"
                        width="53px"
                        height="53px"
                        alt="Default Profile"
                      />
                    )}
                  </div>

                  <NavLink
                    className="info-user-content"
                    to={`/userinfo/${user._id}`}
                  >
                    <p className="para">{user.name}</p>
                  </NavLink>
                </div>
                <div className="btn-sec">
                  <button
                    className={`btn-part ${user.followers.includes(loginUserId) ? 'following' : 'follow'}`}
                    onClick={() => {
                      if (user.followers.includes(loginUserId)) {
                        unfollowUser(user._id, loginUserId);
                      } else {
                        followUser(user._id, loginUserId);
                      }
                    }}
                  >
                    {user.followers.includes(loginUserId)
                      ? "Following"
                      : "Follow"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
       
      </div>
    </div>
  );
};

export default Allusers;