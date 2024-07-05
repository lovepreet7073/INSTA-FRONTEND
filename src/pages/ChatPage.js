import React, { useState, useEffect } from "react";
import ChatSidebar from "../components/chatSidebar";
import Chats from "../components/Chats";
import "../assets/css/chat.css";
import { useDispatch } from "react-redux";
import { fetchChatsSuccess } from "../Reducer/chatReducer";

const ChatPage = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [lastMsg, setLastMsg] = useState('');
  const [OnlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
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
        dispatch(fetchChatsSuccess(data));
      } else {
        throw new Error("Failed to fetch chats");
      }
    } catch (error) {
      console.error("Error fetching chats:", error.message);
    }
  };



  return (
    <div>
      <div className="chatpage">
        <ChatSidebar lastMsg={lastMsg} OnlineUsers={OnlineUsers} />
  
        {selectedUser && (
          <Chats setLastMsg={setLastMsg}  setOnlineUsers={setOnlineUsers} />
        )}
      </div>
    </div>
  );
  
};

export default ChatPage;
