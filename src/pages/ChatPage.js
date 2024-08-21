import React, { useState, useEffect } from "react";
import ChatSidebar from "../components/chatSidebar";
import Chats from "../components/Chats";
import "../assets/css/chat.css";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { setIncomingCall } from "../Reducer/callReducer";
import { addNotification } from "../Reducer/notification";
import { fetchChatsSuccess } from "../Reducer/chatReducer";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { endCall } from '../Reducer/callReducer';
const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastMsg, setLastMsg] = useState('');
  const navigate = useNavigate();
  const [OnlineUsers, setOnlineUsers] = useState([]);
  const [fetchAgain, setFetchAgain] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const dispatch = useDispatch();
  const ENDPOINT = "http://localhost:5000";
  
  const userData = useSelector((state) => state.user.userData);
  var socket;
  useEffect(() => {
  fetchChats();
  }, []);

const fetchChats = async () => {
    try {
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
        setSelectedUser(data);
        setFetchAgain(data)
        dispatch(fetchChatsSuccess(data));
      } else {
        throw new Error("Failed to fetch chats");
      }
    } catch (error) {
      console.error("Error fetching chats:", error.message);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connection", () => socket.emit("join", userData._id));
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
      fetchChats();
    });
    socket.on("message received", (newMessageReceived) => {
    dispatch(addNotification(newMessageReceived));

    });
    socket.on("incomingVideoCall", ({ roomID, from }) => {
      dispatch(setIncomingCall({ roomID, from }));
      console.log("inside-incoming");
    })

  }, [userData]);


  useEffect(() => {
    if (socket && userData?._id) {
      socket.emit("addUser", userData._id);
    }
  }, [userData]);

  return (
    <div className="container-fluid">
      <div className="row chatpage">
        {!selectedChat ? (
          <ChatSidebar
            className="col-12 col-md-4 p-0"
            lastMsg={lastMsg}
            selectedUser={selectedUser}
            OnlineUsers={OnlineUsers}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          selectedUser && (
            <Chats
              fetchChats={fetchChats}
              setLastMsg={setLastMsg}
              setOnlineUsers={setOnlineUsers}
              OnlineUsers={OnlineUsers}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              setSelectedUser={setSelectedUser}
            />
          )
        )}

        {isModalOpen && (
          <Modal
            fetchChats={fetchChats}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setFetchAgain={setFetchAgain}
          />
        )}

      </div>
      {/* <IncomingVideoCall /> */}
    </div>
  );

};

export default ChatPage;
