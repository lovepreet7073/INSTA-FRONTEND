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