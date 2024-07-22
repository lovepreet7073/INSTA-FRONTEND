import React, { useState } from "react";
import Scrollablefeed from "react-scrollable-feed";
import { useSelector } from "react-redux";
import "../assets/css/chat.css";
import moment from "moment";

const ScrollableChat = ({ messages, handleDeleteForMe, handleDeleteForEveryone }) => {
  const userId = useSelector((state) => state.user.userData._id);
  const [dropdownVisibility, setDropdownVisibility] = useState({});
  const toggleDropdown = (messageId) => {
    setDropdownVisibility((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const closeDropdown = (messageId) => {
    setDropdownVisibility((prev) => ({
      ...prev,
      [messageId]: false,
    }));
  };

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).format("LT");
  };

  const getMessageStyles = (message, userId) => {
    let styles = {
      backgroundColor: message.sender?._id === userId ? "#fbc4ab" : "#B9F5D0",
      padding: "5px 15px",
      maxWidth: "75%",
      marginBottom: "10px",
    
      borderRadius: message.sender?._id === userId ? "8px 0px 8px 8px" : "0px 8px 8px 8px",
      position: "relative",
      
    };

    if (message.sender?._id === userId) {
      styles.marginLeft = "auto";
    }
    if (message.content === "This message has been deleted") {
      styles.backgroundColor = "#E0E0E0";
      styles.color = "#757575";

    }
    return styles;
  };

  const handleDownload = async (imageUrl) => {

    try {
      const formattedImageUrl = encodeURIComponent(imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl);

      const response = await fetch(`http://localhost:5000/user/download/${formattedImageUrl}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = formattedImageUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error downloading image:", error.message);
    }
  };
  return (
    <Scrollablefeed>
      {messages &&
        messages.map((message) => (
          <div style={{ display: "flex" }} key={message._id}>
        
            <span style={getMessageStyles(message, userId)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:"11px",color:"#bc21c5",}}>~{message.sender.name}</span>

              {/* <span onClick={() => toggleDropdown(message._id)}>

                <svg
                  style={{ marginLeft: "90%", cursor: "pointer" }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icon-tabler-dots-vertical"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                </svg>
              </span> */}
          
       
              <div className="dropdown">
  <a className="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
  <i className="bi bi-three-dots-vertical" style={{fontSize:"14px",fontWeight:"500",color:"black"}}></i>
  </a>

  <ul className="dropdown-menu">
    <li>
    <button className="dropdown-item" onClick={() => { handleDeleteForMe(message._id); closeDropdown(message._id); }}>
                    Delete for me
                  </button>
     </li>
    <li>
    {message.sender?._id === userId && (
    <button className="dropdown-item" onClick={() => { handleDeleteForEveryone(message._id,message.chat._id); closeDropdown(message._id); }}>
                      Delete for everyone
                    </button>
    )}
      </li>
  </ul>
</div>
</div>
              {message.content && <p style={{ margin: "0px" }}>{message.content}</p>}

              {message.ImageUrl && (
                <div style={{ position: "relative" }}>
                  <div onClick={() => handleDownload(message.ImageUrl)}>
                    <img
                      src={`http://localhost:5000${message.ImageUrl}`}
                      alt="Message"
                      style={{
                        width: "233px",
                        height: "220px",
                        borderRadius: "8px",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                </div>
              )}

              <br />
              <span
                className="setTime"
                style={{ fontSize: "11px", textAlign: "right", color: "#fd0808" }}
              >
                {formatTimestamp(message.createdAt)}
              </span>
            </span>
          </div>
        ))}
    </Scrollablefeed>
  );
};

export default ScrollableChat;
