import React, { useEffect, useState, useRef } from "react";
import "../assets/css/chat.css";
import { useSelector, useDispatch } from "react-redux";
import ScrollableChat from "../components/ScrollableChat";
import io from "socket.io-client";
import { addNotification } from "../Reducer/notification";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import moment from "moment";
import UpdateGroup from "./UpdateGroup";
import { setVideoCall, setIncomingCall, endCall } from "../Reducer/callReducer";
import { useNavigate } from "react-router-dom";
import { closeChat, openChat } from "../Reducer/chatReducer";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare, selectedNotifications;
const Chats = ({
  fetchChats,
  setOnlineUsers,
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
  const [online, setOnline] = useState([]);
  const [openPicker, setOpenPicker] = useState(false);
  const [socketConnected, setsocketConeected] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentCall, setCureentCall] = useState("");
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const userData = useSelector((state) => state.user.userData);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  console.log(selectedChat, "select-chat");
  const videoCall = useSelector((state) => state.call.videoCall);
  const getSender = (loginuser, users) => {
    const otherUser = users?.find((user) => user?._id !== loginuser?._id);
    return {
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
    socket.on("connection", () => setsocketConeected(true));
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
      setOnline(users);
      fetchChats();
    });
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

  useEffect(() => {
    if (socket && userData?._id) {
      socket.emit("addUser", userData._id);
    }
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
        "http://localhost:5000/api/user/sendmessage",
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
        `http://localhost:5000/api/user/allmessages/${selectedChat._id}`,
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
        `http://localhost:5000/user/deleteforeveryone/${messageId}/${chatId}`,
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
        `http://localhost:5000/user/deleteforme/${messageId}`,
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
    // const selectedUser = selectedChat.isGroupChat
    //   ? null
    //   : getSender(userData, selectedChat.users);

    //   dispatch(setVideoCall({
    //     type: 'outgoing',
    //     user: selectedUser,
    //     roomId: Date.now()

    //   }));
  };

  // useEffect(()=>{
  // if(videoCall?.type=== 'outgoing'){
  //   socket.current.emit("outgoing-video-call",{
  //     to:videoCall.id,
  //     from:{
  //       id:userData._id,
  //       profileImage:userData.profileImage,
  //       name:userData.name,
  //     },
  //     roomId:videoCall.roomId,
  //   });
  // }

  // },[videoCall]);

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
      console.log("User removed from chat:", removedUserId);

      const currentUserId = userData._id;

      if (removedUserId === currentUserId) {
        dispatch(closeChat());
      } else {
        dispatch(openChat(chat));
      }
    });

    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare?._id !== newMessageReceived?.chat?._id
      ) {
        if (
          !selectedNotifications.some(
            (notification) => notification._id === newMessageReceived._id
          )
        ) {
          fetchChats();
          fetchMessages();
          dispatch(addNotification(newMessageReceived));
        }
      } else {
        fetchMessages();
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    selectedNotifications = notifications;
  }, [selectedChat, notifications]);

  if (!selectedChat) {
    return (
      <div className="container">
        <div className="text-chat" style={{ marginTop: "20%" }}>
          <h1 style={{ fontSize: "29px" }} className="lineUp">
            Click on a user to <br /> start a new chat
          </h1>
          {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZMXPxjiVSbkndmj8b7oOwoTWpYRTy_0JZZQ&s" alt="" /> */}
        </div>
      </div>
    );
  }

  const handleEmojiSelect = (emoji) => {
    setNewMessage(newMessage + emoji.native);
  };
  const handleback = () => {
    dispatch(closeChat());
    fetchChats()
    setSelectedUser(null);
  };

  return (
    <div className="container ">
      <div className="row no-gutters">
        <div className="col-md-12">
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ borderBottom: "1px solid grey",padding:"4px" }}
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-arrow-left" onClick={handleback}></i>
              {selectedChat.isGroupChat ? (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6rUNxcDVPjBBWCPMIg6sXnvEE95gmls5Jk62kM1de5nxhSttej5SlaTLWMkO9Cd2ZzGQ&usqp=CAU"
                  className="profile-image"
                  width="53px"
                  height="53px"
                  style={{borderRadius:"50px"}}
                />
              ) : (
                <img
                  src={`http://localhost:5000/images/${
                    getSender(userData, selectedChat.users).image
                  }`}
                  alt={`${selectedChat.users.name}'s profile`}
                  width="53px"
                  height="53px"
                  className="profile-image"
                  style={{borderRadius:"50px"}}
                />
              )}
              <div className="text">
                {selectedChat && (
                  <div className="ms-2">
                    <h4 style={{ margin: "2px 0px 2px 0px" }}>
                      {selectedChat.isGroupChat
                        ? selectedChat.chatName
                        : getSender(userData, selectedChat.users).name}
                    </h4>
                    {selectedChat.isGroupChat ? (
                      <span></span>
                    ) : (
                      <>
                        {online.some(
                          (OnlineUser) =>
                            OnlineUser.userId === selectedChat.users[1]._id
                        ) ? (
                          <span
                            className=""
                            style={{ color: "green", fontSize: "12px" }}
                          >
                            Online
                          </span>
                        ) : (
                          <span
                            className=""
                            style={{ color: "red", fontSize: "12px" }}
                          >
                            Offline
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            {selectedChat.isGroupChat ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                onClick={toggleModal}
                fill="#5f6368"
              >
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
              </svg>
            ) : (
              <></>
            )}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "22px" }}
              height="34px"
              onClick={handleVideocall}
              viewBox="0 -960 960 960"
              width="34px"
              fill="#5f6368"
            >
              <path d="M166.78-140.78q-44.3 0-75.15-30.85-30.85-30.85-30.85-75.15v-466.44q0-44.3 30.85-75.15 30.85-30.85 75.15-30.85h466.44q44.3 0 75.15 30.85 30.85 30.85 30.85 75.15V-540l160-160v440l-160-160v173.22q0 44.3-30.85 75.15-30.85 30.85-75.15 30.85H166.78Zm0-106h466.44v-466.44H166.78v466.44Zm0 0v-466.44 466.44Z" />
            </svg>
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
                        marginLeft: "10px",
                        width: "15%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "absolute",
                        top: "56%",
                        left: "25%",
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
                  <button
                    onClick={() => inputref.current.click()}
                    style={{
                      background: "none",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <form>
                      <i class="bi bi-paperclip"></i>
                      <input
                        type="file"
                        id="uploadImg"
                        style={{ display: "none" }}
                        ref={inputref}
                        onChange={handleImg}
                      />
                    </form>
                  </button>

                  <i
                    class="bi bi-emoji-smile"
                    onClick={() => setOpenPicker(!openPicker)}
                  ></i>

                  <form className="" style={{display:"flex"}} onSubmit={sendMessage}>
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
