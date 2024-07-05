import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import "../assets/css/follow.css";
import Swal from "sweetalert2";
const Follow = () => {
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const userData = useSelector((state) => state.user.userData);
  const userId = userData?._id;
  const navigate = useNavigate();
  const fetchFollowData = async () => {
    if(userData?._id){
    try {
      const response = await fetch(
        `http://localhost:5000/user/followapi/${userData?._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setFollowers(data.followers);
      setFollowings(data.following);
    } catch (error) {
      console.error("Error fetching follow data:", error);
    }
}
  };

  useEffect(() => {
    fetchFollowData();
  }, [userData]);

  const handleback = () => {
    navigate("/myprofile");
  };
  const removeFollower = async (followerId,type) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to remove this follower?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });
      if (result.isConfirmed) {
    try {
      const response = await fetch(
        `http://localhost:5000/user/removefollower/${userId}/${followerId}?type=${type}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
        }
      );

      if (response.ok) {
        if(type=='followers'){
        setFollowers(
                    followers.filter((follower) => follower._id !== followerId))
        }else{
            setFollowings(followings.filter((following)=>following._id !== followerId))
        }
      } else {
        console.error("Failed to remove follower");
      }
    } catch (error) {
      console.error("Error removing follower:", error);
    }
}
  };

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="#030303"
        className="bi bi-arrow-left-circle-fill"
        viewBox="0 0 16 16"
        onClick={handleback}
      >
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
      </svg>

      <div className="section-followpage">
        <div className="container-first">
          <div className="followers-head">
            <h4>Followers</h4>
          </div>
          <div>
            {followers.length === 0 ? (
              <div className="err-msg-follow ">No followers yet.</div>
            ) : (
              followers.map((follower) => (
                <div key={follower._id} className="user-part-followpage">
                  <div className="img-name">
                    <div className="imgg">
                      {follower.profileImage ? (
                        <img
                          src={`http://localhost:5000/images/${follower.profileImage}`}
                          alt={`${follower.name}'s profile`}
                          width="53px"
                          height="53px"
                        />
                      ) : (
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgee_ioFQrKoyiV3tnY77MLsPeiD15SGydSQ&usqp=CAU"
                          width="53px"
                          height="53px"
                          alt="Default Profile"
                        />
                      )}
                    </div>
                    <NavLink
                      className="info-user-content"
                      to={`/userinfo/${follower._id}`}
                    >
                      <p className="para">{follower.name}</p>
                    </NavLink>
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a20b0b"
                    stroke-width="2"
                    onClick={() => removeFollower(follower._id, "followers")}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-square-x"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z" />
                    <path d="M9 9l6 6m0 -6l-6 6" />
                  </svg>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="container-second">
          <div className="followers-head">
            <h4>Following</h4>
          </div>
          <div>
            {followings.length === 0 ? (
              <div className="err-msg-follow ">No followings yet.</div>
            ) : (
              followings.map((follow) => (
                <div key={follow._id} className="user-part-followpage">
                  <div className="img-name">
                    <div className="imgg">
                      {follow.profileImage ? (
                        <img
                          src={`http://localhost:5000/images/${follow.profileImage}`}
                          width="53px"
                          height="53px"
                        />
                      ) : (
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgee_ioFQrKoyiV3tnY77MLsPeiD15SGydSQ&usqp=CAU"
                          width="53px"
                          height="53px"
                          alt="Default Profile"
                        />
                      )}
                    </div>
                    <NavLink
                      className="info-user-content"
                      to={`/userinfo/${follow._id}`}
                    >
                      <p className="para">{follow.name}</p>
                    </NavLink>
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a20b0b"
                    stroke-width="2"
                    onClick={() => removeFollower(follow._id, "following")}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-square-x"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z" />
                    <path d="M9 9l6 6m0 -6l-6 6" />
                  </svg>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

 
};

export default Follow;
