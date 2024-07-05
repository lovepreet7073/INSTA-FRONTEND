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
const ChatSidebar = ({ OnlineUsers, lastMsg }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const userData = useSelector((state) => state.user.userData);
  const activeChat = useSelector((state) => state.chat.selectedChat);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
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
  }, [lastMsg]);





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
        <div className="dropdown-side" >
          <button style={{ border: "none" }} onClick={toggleDropdown} >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
            </svg>
            <span class="button__badge">{notifications.length}</span>
          </button>
          <ul className={`dropdown-menu-side ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuLink">
            {notifications.length === 0 ? (
              <li className="dropdown-item-side">No New Messages</li>
            ) : (
              notifications.map((notif, index) => (
                <li
                  className="dropdown-item-side"
                  key={index}
                  onClick={() => handleNotificationClick(notif)}
                >
                  New message from {getSender(userData, notif.chat.users).name}
                </li>
              ))
            )}
          </ul>
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
        <span class="material-symbols-outlined">
          search
        </span>
      </div>

      <div className="setscrool">
        {search
          ? searchResult.map((user) => (
            <div
              key={user._id}
              className={`nav-link-chatpage ${activeChat && activeChat?.users[0]?._id === user?._id
                ? "active-chat-page"
                : ""
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
          :
          users
            .map((user) => {

              return (
                <div
                  key={user._id}
                  className={`nav-link-chatpage ${activeChat && activeChat?._id === user?._id
                    ? "active-chat-page"
                    : ""
                    }`}
                  onClick={() => handleOpenChat(user)}
                >
                  <div className="set-dot">

                    <img
                      src={`http://localhost:5000/images/${getSender(userData, user.users).image}`}
                      alt={`${user.users.name}'s profile`}
                      width="53px"
                      height="53px"
                    />
                     {OnlineUsers.some((OnlineUser) => OnlineUser.userId === user.users[1]?._id) && (
                      <span className="online-indicator"></span>
                    )}
                  </div>
                  <div className="text" style={{ marginRight: "33px",marginTop:"-11px" }}>
                    <span>
                      <h4>{getSender(userData, user.users).name}</h4>
                    </span>
                    <p style={{ marginTop: "-18px" }} className="content">
                      {user._id == lastMsg.chatId ? 
                      lastMsg.content  ?lastMsg.content:
                       lastMsg.image?'Photo':''  : renderLastMessage(user).content}</p>
                  </div>
                  <p className="time" style={{fontSize:'11px'}}>{user._id == lastMsg.chatId ? lastMsg.time : renderLastMessage(user).time}</p>
                </div>

              );
            })}

      </div>
    </div>
  );
};

export default ChatSidebar;
