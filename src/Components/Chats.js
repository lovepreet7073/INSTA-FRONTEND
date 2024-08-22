import React, { useEffect, useState, useRef } from "react";
import { closeChat, openChat } from "../reducer/chatReducer";


import "../assets/css/chat.css";
import { useSelector, useDispatch } from "react-redux";
import ScrollableChat from "../components/ScrollableChat";
import io from "socket.io-client";
import { removeNotification } from "../reducer/notification"
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import moment from "moment";
import UpdateGroup from "./UpdateGroup";
import { useNavigate } from "react-router-dom";
var socket, selectedChatCompare, selectedNotifications;

const Chats = ({
  fetchChats,
  OnlineUsers,
  setLastMsg,
  fetchAgain,
  setFetchAgain,
  setSelectedUser,
}) => {

  useEffect(() => {
    document.title = "Chats";
  }, []);
  const inputref = useRef(null);

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [msgImg, setMsgImg] = useState("");
  const [imgPreview, setImgPreview] = useState("");
  const [openPicker, setOpenPicker] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const ENDPOINT =process.env.REACT_APP_API_BASE_URL;
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const userData = useSelector((state) => state.user.userData);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  console.log(selectedChat,"select-chat")
  const getSender = (loginuser, users) => {
    const otherUser = users?.find((user) => user?._id !== loginuser?._id);
    console.log(loginuser,users,"test")
    return {
      id: otherUser?._id,
      name: otherUser.name,
      image: otherUser.profileImage,
    };
  };
  const dispatch = useDispatch();
  const toggleModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connection", () => socket.emit("join", userData._id));
    socket.on("messageDeleted", (deletedMessageId) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === deletedMessageId
            ? {
              ...message,
              content: "This message has been deleted",
              ImageUrl: null,
            }
            : message
        )
      );
    });

    socket.on("last message", (lastMsgData) => {
      setLastMsg(lastMsgData);
    });
 
  }, [userData]);


  const formatTimestamp = (timestamp) => {
    return moment(timestamp).format("LT");
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage && !msgImg) {
      alert("Content or image is required.");
      return;
    }
    const formData = new FormData();
    formData.append("content", newMessage);
    formData.append("chatId", selectedChat._id);
    if (msgImg) {
      formData.append("image", msgImg);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/user/sendmessage`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      setNewMessage("");
      setMsgImg("");
      setImgPreview("");
      setOpenPicker(false)
      if (inputref.current) {
        inputref.current.value = null;
      }
      socket.emit("new message", data);
      setMessages([...messages, data]);
      const lastMsgData = {
        id: data._id,
        content: data.content,
        chatId: data.chat._id,
        time: formatTimestamp(data.createdAt),
        image: data.ImageUrl,
      };
      setLastMsg(lastMsgData);
      socket.emit("last message", lastMsgData);
    } catch (error) {
      console.error("Error fetching chats:", error.message);
    }
  };

  const handleClearImg = () => {
    setMsgImg("");
    setImgPreview("");
    if (inputref.current) {
      inputref.current.value = null;
    }
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMsgImg(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const fetchMessages = async () => {
    if (!selectedChat || !selectedChat._id) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/user/allmessages/${selectedChat._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
        }
      );
      const data = await response.json();
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Error fetching chats:", error.message);
    }
  };

  const handleDeleteForEveryone = async (messageId, chatId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/user/deleteforeveryone/${messageId}/${chatId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setMessages(data.allMessage);
      let updatedLastMsgData = null;
      if (data.allMessage.length > 0) {
        const lastMessage = data.allMessage[data.allMessage.length - 1];
        updatedLastMsgData = {
          id: lastMessage._id,
          content: lastMessage.content,
          chatId: lastMessage.chat._id,
          time: formatTimestamp(lastMessage.createdAt),
          image: lastMessage.ImageUrl,
        };
      }
      setLastMsg(updatedLastMsgData);
      if (updatedLastMsgData) {
        socket.emit("last message", updatedLastMsgData);
      }
      socket.emit("deleteMessage", messageId);
    } catch (error) {
      console.error("Error deleting message for everyone:", error.message);
    }
  };

  const handleDeleteForMe = async (messageId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/user/deleteforme/${messageId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete message for me");
      }
      const updatedMessages = messages.filter(
        (message) => message._id !== messageId
      );
      setMessages(updatedMessages);
      const deletedMessage = messages.find(
        (message) => message._id === messageId
      );
      if (deletedMessage) {
        const newLastMsg =
          updatedMessages.length > 0
            ? updatedMessages[updatedMessages.length - 1]
            : null;
        setLastMsg(
          newLastMsg
            ? {
              id: newLastMsg._id,
              content: newLastMsg.content,
              chatId: newLastMsg.chat._id,
              time: formatTimestamp(newLastMsg.createdAt),
              image: newLastMsg.ImageUrl,
            }
            : null
        );
      }
    } catch (error) {
      console.error("Error deleting message for me:", error.message);
    }
  };

  const handleVideocall = () => {
    const roomID = Date.now().toString();
    navigate(`/videocall/${roomID}`);

    
    if (selectedChat && !selectedChat.isGroupChat) {
      const otherUser = getSender(userData, selectedChat.users);
      console.log(otherUser, "jim");

      socket.emit("startVideoCall", {
        to: otherUser.id,
        roomID: roomID,
        from: {
          id: userData._id,
          name: userData.name,
          profileImage: userData.profileImage,
        },
      });
    }
  };



  useEffect(() => {
    socket.on("group created", () => {
      fetchChats();
    });

    socket.on("userLeftGroup", (chat) => {
      fetchChats();
      dispatch(openChat(chat));
    });
    socket.on("UpdateGroup-name", (newChat) => {
      fetchChats();
      dispatch(openChat(newChat));
    });

    socket.on("userRemoved", ({ chat, removedUserId }) => {
      fetchChats();

      const currentUserId = userData._id;

      if (removedUserId === currentUserId) {
        dispatch(closeChat());
      } else {
        dispatch(openChat(chat));
      }
    });

  }, [socket]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    selectedNotifications = notifications;
    notifications.forEach(notification => {
      if (notification.chat._id === selectedChat._id) {
        dispatch(removeNotification(notification._id));
      }
    });
  }, [selectedChat, notifications]);


  const handleEmojiSelect = (emoji) => {
    setNewMessage(newMessage + emoji.native);
  };
  const handleback = () => {
    dispatch(closeChat());
    fetchChats()
    setSelectedUser(null);
  };

  return (
    <div className="container">
      <div className="row no-gutters">
        <div className="col-md-12" >
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ borderBottom: "1px solid grey", padding: "4px" }}
          >
            <div className="d-flex align-items-center" style={{ gap: "13px" }}>
              <i className="bi bi-arrow-left" style={{ cursor: "pointer" }} onClick={handleback}></i>
              {selectedChat?.isGroupChat ? (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6rUNxcDVPjBBWCPMIg6sXnvEE95gmls5Jk62kM1de5nxhSttej5SlaTLWMkO9Cd2ZzGQ&usqp=CAU"
                  className="profile-image"
                  width="53px"
                  height="53px"
                  style={{ borderRadius: "50px" }}
                />
              ) : (
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/images/${getSender(userData, selectedChat?.users).image
                    }`}
                  alt={`${selectedChat.users.name}'s profile`}
                  width="53px"
                  height="53px"
                  className="profile-image"
                  style={{ borderRadius: "50px" }}
                />
              )}
              <div className="text">
                {selectedChat && (
                  <div className="ms-2">
                    <h5 style={{ margin: "2px 0px 2px 0px" }}>
                      {selectedChat.isGroupChat
                        ? selectedChat.chatName
                        : getSender(userData, selectedChat?.users).name}
                    </h5>
                    {selectedChat.isGroupChat ? (
                      <span></span>
                    ) : (
                      <>
                        {!selectedChat?.isGroupChat && (
                          OnlineUsers.some((OnlineUser) => OnlineUser.userId === selectedChat.users[1]?._id) ? (
                            <span className="text-green">Online</span>
                          ) : (
                            <span className="text-red">Offline</span>
                          )
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="set-head">
              {selectedChat.isGroupChat ? (
                <i class="bi bi-eye-fill" onClick={toggleModal} style={{ fontSize: "26px", cursor: "pointer" }}></i>
              ) : (
                <></>
              )}

              <i class="bi bi-camera-video" onClick={handleVideocall} style={{ fontSize: "26px", cursor: "pointer" }}></i>
            </div>
          </div>
          <div className="chat-panel">
            <div className="row no-gutters">
              <div className="col-md-3"></div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="messages">
                  {isUpdateModalOpen && (
                    <UpdateGroup
                      isUpdateModalOpen={isUpdateModalOpen}
                      setIsUpdateModalOpen={setIsUpdateModalOpen}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages={fetchMessages}
                    />
                  )}
                  <ScrollableChat
                    messages={messages}
                    handleDeleteForMe={handleDeleteForMe}
                    handleDeleteForEveryone={handleDeleteForEveryone}
                  />

                  {msgImg && (
                    <div
                      style={{

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "absolute",
                        top: "55%",

                      }}
                    >

                      <svg
                        className="cross-svg"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#33333"
                        onClick={handleClearImg}
                      >
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                      </svg>

                      <img
                        src={imgPreview}
                        alt="Preview"
                        style={{
                          maxWidth: "160px",
                          borderRadius: "8px",
                          marginTop: "25px",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    zIndex: "10",
                    display: openPicker ? "inline" : "none",
                    position: "absolute",
                    bottom: "75px",
                    right: "90px",
                  }}
                >
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
                <div className="setfield">
                  <div className="icon-form">
                    <button
                      onClick={() => inputref.current.click()}
                      style={{
                        background: "none",
                        border: "none",
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >

                      <i class="bi bi-paperclip"
                        style={{ fontSize: "20px" }}></i>
                      <input
                        type="file"
                        id="uploadImg"
                        style={{ display: "none" }}
                        ref={inputref}
                        onChange={handleImg}
                      />

                    </button>
                    <i
                      class="bi bi-emoji-smile"
                      style={{ fontSize: "20px", cursor: "pointer" }}
                      onClick={() => setOpenPicker(!openPicker)}
                    ></i>
                  </div>
                  <form className="form-input" style={{ display: "flex", gap: "12px", justifyContent: 'space-around' }} onSubmit={sendMessage}>
                    <input
                      class="form-control form-control-lg"
                      onChange={typingHandler}
                      value={newMessage}
                      type="text"
                      placeholder="Type your message here..."
                      aria-label=".form-control-lg example"
                    ></input>
                    <button className="btn btn-primary" onClick={sendMessage}>
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
