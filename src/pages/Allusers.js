import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "../assets/css/allusers.css";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
const Allusers = () => {
  useEffect(() => {
    document.title = "All Users"
  }, [])
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
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
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [loginUserId]);
  const indexOfLastUser = (currentPage) * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (data) => {
    setCurrentPage(data.selected + 1);
  };
  const handleSerach = (e) => {
    const query = e.target.value.toLowerCase();
    if (query == "") {
      fetchUsers();
      return;
    }
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(query)
    );

    setUsers(filtered);

    setCurrentPage(1);
    if (filtered.length === 0) {
      setError("No user found!❌");
    }
  };
  return (
    <div>
      <h3 className="allusers-head"></h3>

      <div className="section-allusers">
        <div className="search-bar" style={{}} >
          <input
            className="input-sec-allusers"
            type="search"
            placeholder="Search by name"
            aria-label="Search"
            onChange={handleSerach}
          />
          <span class="material-symbols-outlined">
            search
          </span>
        </div>
        {users.length === 0 ? (
          <div className="err-msg">{error}</div>
        ) : (
          <div className="user-list">
            {currentUsers.map((user) => (
              <div key={user._id} className="user-part">
                <div className="img-name">
                  <div className="imgg">
                    {user.profileImage ? (
                      <img
                        src={`http://localhost:5000/images/${user.profileImage}`}
                        alt={`${user.name}'s profile`}
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
        {currentUsers.length > 6 && (
          <ReactPaginate
            previousLabel={"<<"}
            nextLabel={">>"}
            breakLabel={"..."}
            pageCount={Math.ceil(users.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        )}
      </div>
    </div>
  );
};

export default Allusers;
