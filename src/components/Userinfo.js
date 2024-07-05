import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/userinfo.css";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import UserPost from "../pages/UserPost";

const followUser = async (userId, loginUserId, setFollowers, setIsFollow) => {
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
        setFollowers((prevFollowers) => prevFollowers + 1);
        setIsFollow(true);
      }
    } else {
      console.error("Failed to follow user");
    }
  } catch (error) {
    console.error("An error occurred while trying to follow the user", error);
  }
};

const unfollowUser = async (userId, loginUserId, setFollowers, setIsFollow) => {
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
        setFollowers((prevFollowers) => prevFollowers - 1);
        setIsFollow(false);
      }
    } else {
      console.error("Failed to unfollow user");
    }
  } catch (error) {
    console.error("An error occurred while trying to unfollow the user", error);
  }
};

export { followUser, unfollowUser };

const Userinfo = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isFollow, setIsFollow] = useState(false);
  const [followers, setFollowers] = useState();
  const loginUserId = useSelector((state) => state.user.userData._id);
  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);

        setFollowers(data.followers.length);
        if (data.followers.includes(loginUserId)) {
          setIsFollow(true);
        }
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      setError("An error occurred while fetching user data");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId, isFollow]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="profile">
        <div className="profile-frame">
          {userData && (
            <>
              <div className="profile-pic">
                {userData.profileImage ? (
                  <img
                    src={`http://localhost:5000/images/${userData.profileImage}`}
                    alt={`${userData.name}'s profile`}
                    width="130px"
                    height="130px"
                  />
                ) : (
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgee_ioFQrKoyiV3tnY77MLsPeiD15SGydSQ&usqp=CAU"
                    alt="Default Profile"
                    width="130px"
                    height="130px"
                  />
                )}
                </div>
                <div className="profile-data">
                <h1>
                    <strong>{userData.name}</strong>{" "}
                  </h1>

                  <div className="profile-info" style={{display:"flex"}}>
          <p> {userData.posts.length}  posts</p>
          <p>{followers} followers</p>
          <p>{userData.following.length} following</p>
                  </div>
                 
                   <div className="set-btn">
                    <div className="button-sec">
                      <button
                        className={`btn-part ${userData.followers.includes(loginUserId) ? 'following' : 'follow'}`}
                        onClick={() => {
                          if (userData.followers.includes(loginUserId)) {
                            unfollowUser(
                              userData._id,
                              loginUserId,
                              setFollowers,
                              setIsFollow
                            );
                          } else {
                            followUser(
                              userData._id,
                              loginUserId,
                              setFollowers,
                              setIsFollow
                            );
                          }
                        }}
                      >
                        {userData.followers.includes(loginUserId)
                          ? "Following"
                          : "Follow"}
                      </button>
                    </div>
                  </div> 
                </div>

             

            </>
          )}
        </div>
      </div>

      <div className="userpost-sec">
        <UserPost userId={userId} />
      </div>
    </>
  );
};

export default Userinfo;
