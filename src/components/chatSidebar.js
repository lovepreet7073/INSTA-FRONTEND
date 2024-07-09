import React, { useState, useEffect } from "react";
import "../assets/css/chatsidebar.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchChatsRequest,
  openChat,
  fetchChatsFailure,
} from "../Reducer/chatReducer";
import { removeNotification } from "../Reducer/notification";
import moment from "moment";

const ChatSidebar = ({ OnlineUsers, lastMsg,fetchAgain,setFetchAgain ,isModalOpen, setIsModalOpen}) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  console.log(users, "users")
  const userData = useSelector((state) => state.user.userData);
  const activeChat = useSelector((state) => state.chat.selectedChat);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const notifications = useSelector((state) => state.notifications.notifications);
// State for modal visibility
  // State for add users input

  const accessChat = async (userId) => {
    const existingUser = users.find((user) => user._id === userId);
    if (existingUser) {
      return;
    }
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
      console.log(responseData, "datares")
      dispatch(openChat(responseData));

      fetchChats();
      dispatch(fetchChatsRequest());
      setSearch("");
    } catch (error) {
      console.error("Error accessing chat:", error);
    }
  };

  const handleSearch = async (event) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);

    if (searchTerm === "") {
      fetchChats();
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users?search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
        }
      );
      if (response.ok) {
        const searchData = await response.json();
        setSearchResult(searchData);
      } else {
        throw new Error("Failed to search users");
      }
    } catch (error) {
      console.error("Error searching users:", error.message);
    }
  };

  const fetchChats = async () => {
    try {
      dispatch(fetchChatsRequest());

      const response = await fetch(
        "http://localhost:5000/api/user/fetchchats",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const sortedChats = data.sort((a, b) => {
          if (!a.latestMessage || !b.latestMessage) return 0;
          return new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt);
        });
// setFetchAgain(sortedChats)
        setUsers(sortedChats);
      } else {
        throw new Error("Failed to fetch chats");
      }
    } catch (error) {
      console.error("Error fetching chats:", error.message);
      dispatch(fetchChatsFailure(error.message));
    }
  };

  useEffect(() => {
    fetchChats();
  }, [lastMsg,fetchAgain]);

  const getSender = (loginuser, users) => {
    return users[0]?._id === loginuser?._id
      ? { name: users[1]?.name, image: users[1]?.profileImage }
      : { name: users[0]?.name, image: users[0]?.profileImage };
  };

  const handleNotificationClick = (notif) => {
    handleOpenChat(notif.chat);
  };

  const handleOpenChat = (chat) => {
    const sameSenderNotifications = notifications.filter(
      (notification) => notification.chat._id === chat._id
    );
    sameSenderNotifications.forEach((notification) => {
      dispatch(removeNotification(notification._id));
    });

    dispatch(openChat(chat));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).format("LT");
  };

  const renderLastMessage = (chat) => {
    if (chat.latestMessage) {
      const time = formatTimestamp(chat.latestMessage.createdAt);
      const content = chat.latestMessage.ImageUrl ? "Photo" : chat.latestMessage.content;
      return { content: content, time: time };
    }
    return { content: "No messages yet", time: "" };
  };




  return (
    <div className="chatsidebar">
     

      <div className="header-chat">
        {userData.profileImage ? (
          <img
            src={`http://localhost:5000/images/${userData.profileImage}`}
            alt={`${userData.name}'s profile`}
            width="53px"
            height="53px"
          />
        ) : (
          <img
            src="https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F10337%2F10337609.png&tbnid=Wcjgsjc23IBTzM&vet=10CAYQxiAoCGoXChMIwI3i7fDQhgMVAAAAAB0AAAAAEAY..i&imgrefurl=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fuser-profile_10337609&docid=x74aCouV216MfM&w=512&h=512&itg=1&q=user%20profile%20img%20&ved=0CAYQxiAoCGoXChMIwI3i7fDQhgMVAAAAAB0AAAAAEAY"
          />
        )}
        <div className="set-gorupicon">
          <div className="dropdown-side" style={{ display: "flex", alignItems: "center" }}>
            <div className="newgroup">
              <button onClick={toggleModal} style={{ border: "none" }}>

                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#eeeee"><path d="M500-482q29-32 44.5-73t15.5-85q0-44-15.5-85T500-798q60 8 100 53t40 105q0 60-40 105t-100 53Zm220 322v-120q0-36-16-68.5T662-406q51 18 94.5 46.5T800-280v120h-80Zm80-280v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Zm-480-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM0-160v-112q0-34 17.5-62.5T64-378q62-31 126-46.5T320-440q66 0 130 15.5T576-378q29 15 46.5 43.5T640-272v112H0Zm320-400q33 0 56.5-23.5T400-640q0-33-23.5-56.5T320-720q-33 0-56.5 23.5T240-640q0 33 23.5 56.5T320-560ZM80-240h480v-32q0-11-5.5-20T540-306q-54-27-109-40.5T320-360q-56 0-111 13.5T100-306q-9 5-14.5 14T80-272v32Zm240-400Zm0 400Z" /></svg>


              </button>
            </div>
            <button style={{ border: "none" }} onClick={toggleDropdown}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                class="bi bi-bell-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
              </svg>
              <span class="button__badge">{notifications.length}</span>
            </button>
            <ul className={`dropdown-menu-side ${isDropdownOpen ? "show" : ""}`} aria-labelledby="dropdownMenuLink">
              {notifications.length === 0 ? (
                <li className="dropdown-item-side">No New Messages</li>
              ) : (
                notifications.map((notif, index) => (
                  <li
                    className="dropdown-item-side"
                    key={index}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`:`New message from ${getSender(userData,notif.chat.users).name}`}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="set-search">
        <input
          placeholder="Search here"
          type="text"
          value={search}
          onChange={handleSearch}
          className="input-sec"
        />
        <span class="material-symbols-outlined">search</span>
      </div>

      <div className="setscrool">
        {search ? (
          searchResult.map((user) => (
            <div
              key={user._id}
              className={`nav-link-chatpage ${activeChat && activeChat?.users[0]?._id === user?._id ? "active-chat-page" : ""
                }`}
              onClick={() => accessChat(user?._id)}
            >
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
              <div className="text">
                <span>
                  <h6>{user.name}</h6>
                </span>
              </div>
            </div>
          ))
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className={`nav-link-chatpage ${activeChat && activeChat?._id === user?._id ? "active-chat-page" : ""
                }`}
              onClick={() => handleOpenChat(user)}
            >
              <div className="set-dot" style={{ objectFit: "contain" }}>
                {user.isGroupChat ? (<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6rUNxcDVPjBBWCPMIg6sXnvEE95gmls5Jk62kM1de5nxhSttej5SlaTLWMkO9Cd2ZzGQ&usqp=CAU" width="53px"
                  height="53px" />) : (
                  <img
                    src={`http://localhost:5000/images/${getSender(userData, user.users).image}`}
                    alt={`${user.users.name}'s profile`}
                    width="53px"
                    height="53px"
                  />
                )}
                {!user.isGroupChat && OnlineUsers.some((OnlineUser) => OnlineUser.userId === user.users[1]?._id) && (
    <span className="online-indicator"></span>
  )}
              </div>
              <div className="text" style={{ marginRight: "33px", marginTop: "-11px" }}>
                <span>
                  <h4>{user.isGroupChat ? user.chatName : getSender(userData, user.users).name}</h4>
                </span>
                <p style={{ marginTop: "-18px" }} className="content">
                  {user._id == lastMsg.chatId ? (lastMsg.content ? lastMsg.content : lastMsg.image ? "Photo" : "") : renderLastMessage(user).content}
                </p>
              </div>
              <p className="time" style={{ fontSize: "11px" }}>
                {user._id == lastMsg.chatId ? lastMsg.time : renderLastMessage(user).time}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ChatSidebar;
