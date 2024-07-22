import React, { useState, useEffect } from "react";
import ChatSidebar from "../components/chatSidebar";
import Chats from "../components/Chats";
import "../assets/css/chat.css";
import { useSelector, useDispatch } from "react-redux";
import IncomingVideoCall from "../components/IncomingVideoCall";
import { fetchChatsSuccess } from "../Reducer/chatReducer";
import Modal from "../components/Modal";
const ChatPage = () => {
  // const incomingVideoCall = useSelector((state) => state.call.incomingVideoCall);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastMsg, setLastMsg] = useState('');
  const [OnlineUsers, setOnlineUsers] = useState([]);
  const [fetchAgain, setFetchAgain] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  console.log(selectedChat,"chat-sleected")
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
console.log(data,"test-data")
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
