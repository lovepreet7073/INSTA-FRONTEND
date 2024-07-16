import React, { useState, useEffect } from "react";
import "../assets/css/myprofile.css";
import {  useSelector } from "react-redux";
import UserPost from "../pages/UserPost";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  useEffect(()=>{
    document.title="MyProfile"  
    },[])
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState();
  const [postLength, setPostLength] = useState();
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user.userData._id);

  const fetchUserData = async () => {
    if(userId){
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
        setPostLength(data.posts.length)
        setFollowers(data.followers.length);
        setUserData(data);
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      setError("An error occurred while fetching user data");
    }
  }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);
const handleEdit = ()=>{
  navigate("/editprofile")
}
const handlecreatepost = ()=>{
  navigate("/createpost")
}
  return (
    <>
      <div className="profilePage">

        <div className="profile-frame">
          {error && <h3>{error}</h3>}
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
                  width="53px"
                  height="53px"
                  alt="Default Profile"
                />
                )}
                </div>

                <div className="profile-data">
    

                  <h1>
                    <strong>{userData.name}</strong>{" "}
                  </h1>
                  <div className="profile-info" style={{display:"flex"}}>
          <p>{postLength} posts</p>
          <p>{followers} followers</p>
          <p>{userData.following.length} following</p>
                  </div>
                  <div className="all-btns" style={{display:"flex",justifyContent:"space-between",width:"110%",fontWeight:"bold"}}>
                  <button className="btn-edit" onClick={handleEdit}>  Edit <i className="bi bi-pencil"></i> </button>
                  <div></div>
                <div>
                <button className="btn-create-sec" style={{marginLeft:"10px"}} onClick={handlecreatepost}>    Create Post  <i className="bi bi-pencil-square"></i> </button>

                  </div>  
                  <button className="btn-passowrd-sec" style={{marginLeft:"10px"}}  onClick={()=>navigate("/password")}>    Change Password <i class="bi bi-key-fill"></i> </button>
                  <div></div>
                </div> 
                </div>

         
              
              
            </>
          )}
        </div>
<div className="gallery">
<UserPost userId={userId} postLength={postLength}
            setPostLength={setPostLength}/>
</div>

      </div>

      
    
    </>
  );
};

export default MyProfile;
