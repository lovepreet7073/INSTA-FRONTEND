import { React, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { closeChat, updateSelectedUsers } from "../Reducer/chatReducer";
import io from "socket.io-client";
const UpdateGroup = ({ isUpdateModalOpen, setIsUpdateModalOpen, setFetchAgain, fetchMessages }) => {

  const [search, setSearch] = useState('');
  const [serachResult, setSerachResult] = useState([]);
  const [updategroupName, setUpdateGroupName] = useState([]);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const userData = useSelector((state) => state.user.userData);
  const ENDPOINT = "http://localhost:5000";
  var socket = io(ENDPOINT);
  const dispatch = useDispatch()
  const toggleModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };
  const handleRename = async () => {
    if (!updategroupName) return;
    const formData = {
      chatName: updategroupName,
      chatId: selectedChat._id,
    };
    try {
      const response = await fetch('http://localhost:5000/user/api/renamegroup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedChat = await response.json();
        console.log(updatedChat, "updated")
        socket.emit('updateGroup', updatedChat)
        setFetchAgain(updatedChat)
        setUpdateGroupName("")
        setIsUpdateModalOpen(false);
      } else {
        throw new Error('Error creating group');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  const handleSearch = async (searchTerm) => {
    setSearch(searchTerm);

    if (searchTerm === '') {
      setSerachResult([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users?search=${searchTerm}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
        },
      });
      if (response.ok) {
        const searchData = await response.json();
        setSerachResult(searchData);
      } else {
        throw new Error('Failed to search users');
      }
    } catch (error) {
      console.error('Error searching users:', error.message);
    }
  };
  const handleRemove = async (user1) => {

    const dataUsers = {
      userId: user1._id,
      chatId: selectedChat._id,
    };

    try {
      const response = await fetch(`http://localhost:5000/user/api/groupremove`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
        },
        body: JSON.stringify(dataUsers),
      });
      if (response.ok) {
        const data = await response.json();
        socket.emit('leaveGroup', data)
        dispatch(closeChat());
        setFetchAgain(data)
        fetchMessages()
      } else {
        throw new Error('Failed to add users');
      }
    } catch (error) {
      console.error('Error addding users:', error.message);
    }

  };


  const handleAdduser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      console.log("user alreday in group")
      alert("user already in group")
      return;
    }
    const dataUsers = {
      userId: user1._id,
      chatId: selectedChat._id,
    };

    try {
      const response = await fetch(`http://localhost:5000/user/api/groupadd`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
        },
        body: JSON.stringify(dataUsers),
      });
      if (response.ok) {
        const data = await response.json();
        setFetchAgain(data)
        socket.emit("addUser", user1._id);
        dispatch(updateSelectedUsers(data.users));
        setSearch('');
        setSerachResult([]);
      } else {
        throw new Error('Failed to add users');
      }
    } catch (error) {
      console.error('Error addding users:', error.message);
    }

  }

  const handleRemoveUser = async (userId) => {
    const dataUsers = {
      requesterId: selectedChat.groupAdmin,
      chatId: selectedChat._id,
    };

    try {
      const response = await fetch(`http://localhost:5000/user/api/userremove/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
        },
        body: JSON.stringify(dataUsers),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data, "check")
        socket.emit('removeuserbyadmin', data.chat, userId);
      } else {
        throw new Error('Failed to add users');
      }
    } catch (error) {
      console.error('Error addding users:', error.message);
    }

  };
  return (
    <div>
      {isUpdateModalOpen && (
        <div className={`modal fade ${isUpdateModalOpen ? 'show' : ''}`} style={{ display: isUpdateModalOpen ? 'block' : 'none' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedChat?.chatName}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={toggleModal}></button>
              </div>
              <div className="modal-body">
                {selectedChat && (
                  <>
                    <div className={selectedChat.groupAdmin === userData._id ? 'users-list' : 'users-list-other'}>
                      {selectedChat.users.map((u) => (
                        <div key={u._id} className={selectedChat.groupAdmin === userData._id ? 'selected-user' : 'selected-user-list'}>
                          <h6>{u.name}</h6>
                          {selectedChat.groupAdmin === userData._id && (
                            <span style={{ cursor: 'pointer' }} onClick={() => handleRemoveUser(u._id)}>
                              &times;
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    {selectedChat.groupAdmin === userData._id && (
                      <>
                        <div className="input-control ">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Chat Name"
                            value={updategroupName}
                            onChange={(e) => setUpdateGroupName(e.target.value)}
                          />
                          <button type="button" className="btn btn-primary" onClick={handleRename}>
                            Update
                          </button>
                        </div>
                        <div className="input-control ">
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="Add Users to group"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    {serachResult.map((user) => (
                      <div key={user._id} className="d-flex align-items-center mb-2">
                        <img
                          src={user.profileImage ? `http://localhost:5000/images/${user.profileImage}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgee_ioFQrKoyiV3tnY77MLsPeiD15SGydSQ&usqp=CAU"}
                          alt={`${user.name}'s profile`}
                          width="53px"
                          height="53px"
                          style={{ borderRadius: "50px" }}
                        />
                        <div className="ms-3">
                          <h6 className="mb-0" style={{ cursor: "pointer" }} onClick={() => handleAdduser(user)}>{user.name}</h6>

                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={() => handleRemove(userData)}>
                  Leave Group
                </button>
                <button type="button" className="btn btn-secondary" onClick={toggleModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdateGroup