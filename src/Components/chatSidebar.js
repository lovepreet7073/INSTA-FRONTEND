import React, { useState, useEffect } from "react";
import "../assets/css/chatsidebar.css";
import { useSelector, useDispatch } from "react-redux";
import Skeleton from 'react-loading-skeleton';
import {
  fetchChatsRequest,
  openChat,
  fetchChatsFailure,
} from "../reducer/chatReducer";

import { removeNotification } from "../reducer/notification";
import moment from "moment";

const ChatSidebar = ({ OnlineUsers, lastMsg, fetchAgain, setFetchAgain, isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const itemsPerPage = 3;
  const userData = useSelector((state) => state.user.userData);
  const activeChat = useSelector((state) => state.chat.selectedChat);
  const [loading, setLoading] = useState(true); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const notifications = useSelector((state) => state.notifications.notifications);
  const accessChat = async (userId) => {
    const existingUser = users.find((user) => user._id === userId);
    if (existingUser) {
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/chat`, {
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
    setLoading(true)
    const searchTerm = event.target.value;
    setSearch(searchTerm);

    if (searchTerm === "") {
      fetchChats();
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users?search=${searchTerm}`,
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
        setTimeout(()=>{
          setSearchResult(searchData);
        },1000)
        setLoading(false)
        
      } else {
        throw new Error("Failed to search users");
      }
    } catch (error) {
      console.error("Error searching users:", error.message);
    }finally{
      setLoading(false)
    }
  };

  const fetchChats = async () => {
    try {
      dispatch(fetchChatsRequest());

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/user/fetchchats`,
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
        console.log('Sorted chats:', sortedChats);

        setLoading(false);
      } else {
        throw new Error("Failed to fetch chats");
      }
    } catch (error) {
      dispatch(fetchChatsFailure(error.message));
    }finally{
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [lastMsg, fetchAgain]);



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
  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
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
    <div className="container" style={{ width: "50%", textAlign: "left" }}>
      <div className="d-flex justify-content-between align-items-center p-3">
        <h3>Chats</h3>
        <div className="d-flex">
          <button onClick={toggleModal} className="btn btn-light">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#eeeee">
              <path d="M500-482q29-32 44.5-73t15.5-85q0-44-15.5-85T500-798q60 8 100 53t40 105q0 60-40 105t-100 53Zm220 322v-120q0-36-16-68.5T662-406q51 18 94.5 46.5T800-280v120h-80Zm80-280v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Zm-480-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM0-160v-112q0-34 17.5-62.5T64-378q62-31 126-46.5T320-440q66 0 130 15.5T576-378q29 15 46.5 43.5T640-272v112H0Zm320-400q33 0 56.5-23.5T400-640q0-33-23.5-56.5T320-720q-33 0-56.5 23.5T240-640q0 33 23.5 56.5T320-560ZM80-240h480v-32q0-11-5.5-20T540-306q-54-27-109-40.5T320-360q-56 0-111 13.5T100-306q-9 5-14.5 14T80-272v32Zm240-400Zm0 400Z" />
            </svg>
          </button>
          <button onClick={toggleSearchBar} className="btn btn-light ms-2">
            <i className="bi bi-search"></i>
          </button>
          <div className="dropdown ms-2">
            <button className="btn btn-light dropdown-toggle" onClick={toggleDropdown}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
              </svg>
              <span className="badge bg-danger" style={{ top: "-11px", right: "10px" }}>{notifications.length}</span>
            </button>
            <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
              {notifications.length === 0 ? (
                <li className="dropdown-item">No New Messages</li>
              ) : (
                notifications.map((notif, index) => (
                  <li key={index} className="dropdown-item" onClick={() => handleNotificationClick(notif)}>
                    {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New message from ${getSender(userData, notif.chat.users).name}`}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
      {isSearchVisible && (
        <div className="pb-3">
          <input
            placeholder="Search here"
            type="text"
            value={search}
            onChange={handleSearch}
            className="form-control"
          />
        </div>
      )}
  <div>
      {loading ? (
        // Skeleton loader while searching
        <div className="user-list">
          {[...Array(itemsPerPage)].map((_, index) => (
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
      ) : search ? (
        searchResult.map((user) => (
          <div
            key={user._id}
            style={{ cursor: "pointer" }}
            className={`d-flex align-items-center p-2 ${activeChat && activeChat?.users[0]?._id === user?._id ? "bg-light" : ""}`}
            onClick={() => accessChat(user?._id)}
          >
            {user.profileImage ? (
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/images/${user.profileImage}`}
                alt={`${user.name}'s profile`}
                className="rounded-circle me-2"
                width="53"
                height="53"
              />
            ) : (
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgee_ioFQrKoyiV3tnY77MLsPeiD15SGydSQ&usqp=CAU"
                className="rounded-circle me-2"
                width="53"
                height="53"
                alt="Default Profile"
              />
            )}
            <div>
              <h6 className="mb-0">{user.name}</h6>
            </div>
          </div>
        ))
        ) : (
          <>
            {loading ? (
              // Skeleton loader while loading
              <div className="user-list">
                {[...Array(itemsPerPage)].map((_, index) => (
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
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  style={{ cursor: "pointer", background: "white" }}
                  className={`d-flex align-items-center p-2 border-bottom${activeChat && activeChat?._id === user?._id ? " bg-light" : ""}`}
                  onClick={() => handleOpenChat(user)}
                >
                  <div className="position-relative">
                    {user.isGroupChat ? (
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6rUNxcDVPjBBWCPMIg6sXnvEE95gmls5Jk62kM1de5nxhSttej5SlaTLWMkO9Cd2ZzGQ&usqp=CAU"
                        className="rounded-circle me-2"
                        width="53"
                        height="53"
                        alt="Group Chat"
                      />
                    ) : (
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/images/${getSender(userData, user.users).image}`}
                        alt={`${getSender(userData, user.users).name}'s profile`}
                        className="rounded-circle me-2"
                        width="53"
                        height="53"
                      />
                    )}
                    {!user?.isGroupChat && OnlineUsers.some((OnlineUser) => OnlineUser.userId === user.users[1]?._id) && (
                      <span className="online-dot"></span>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0">{user.isGroupChat ? user.chatName : getSender(userData, user.users).name}</h6>
                    <small className="text-muted">{user._id === lastMsg.chatId ? (lastMsg.content ? lastMsg.content : lastMsg.image ? "Photo" : "") : renderLastMessage(user).content}</small>
                  </div>
                  <small className="text-muted ms-auto">{user._id === lastMsg.chatId ? lastMsg.time : renderLastMessage(user).time}</small>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
