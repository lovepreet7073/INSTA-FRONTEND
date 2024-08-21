import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/css/userinfo.css";
import "react-toastify/dist/ReactToastify.css";
import { useSelector ,useDispatch} from "react-redux";
import UserPost from "../pages/UserPost";
import { followUser, unfollowUser } from "../functions/followFunction";
import {
  openChat,
} from "../Reducer/chatReducer";

const Userinfo = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isFollow, setIsFollow] = useState(false);
  const [followers, setFollowers] = useState();
  
  const navigate = useNavigate()
  const activeChat = useSelector((state) => state.chat.selectedChat);
  console.log(activeChat,"chat")
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
        console.log(data,"ereeee")
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
  const accessChat = async (userId) => {
    
    try {
      const response = await fetch(`http://localhost:5000/api/user/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
        },
        body: JSON.stringify({ userId }),
      });
      const responseData = await response.json();
      console.log(responseData,"repldata")
      dispatch(openChat(responseData));

    } catch (error) {
      console.error("Error accessing chat:", error);
    }
  };
  const handleOpenChat = (chat) => {
    accessChat(userData._id);
  };
  if (error) {
    return <div>{error}</div>;
  }

if(activeChat){
  navigate('/chatpage')
}else{
  <></>
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

                <div className="profile-info" style={{ display: "flex" }}>
                  <p> {userData.posts.length}  posts</p>
                  <p >{followers} followers</p>

                  <p>{userData.following.length} following</p>
                </div>

                {loginUserId !== userId && (
                  <div className="button-sec" style={{display:"flex",gap:"12px",justifyContent:"center"}}>
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
                    {userData.followers.includes(loginUserId) && (
      <button style={{ fontSize: "14px" }} onClick={handleOpenChat} className="btn btn-primary">
        Message
      </button>
    )}
                  </div>
                )}
              </div>



            </>
          )}
        </div>
      </div>

      <div className="userpost-sec">
        {isFollow ? (
          <UserPost userId={userId} isFollow={isFollow} />) : (<></>)
        }
      </div>
    </>
  );
};

export default Userinfo;
