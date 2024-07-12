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
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>
                            &times;
                        </span>
                        {selectedChat && (
                            <>
                                <h2>
                                    {selectedChat.chatName}
                                </h2>

                                <div className={selectedChat.groupAdmin === userData._id ? `users-list` : `users-list-other`}>
                                    {selectedChat.users.map((u) => (
                                        <div key={u._id} className={selectedChat.groupAdmin === userData._id ? `selected-user` : `selected-user-list`}>
                                            <h6>{u.name}</h6>
                                            {selectedChat.groupAdmin !== userData._id ? (<>
                                            </>) : (
                                                <span style={{ cursor: 'pointer' }} onClick={() => handleRemoveUser(u._id)}>
                                                    &times;
                                                </span>
                                            )}

                                        </div>
                                    ))}

                                </div>
                                {selectedChat.groupAdmin !== userData._id ? (<>
                                </>) :
                                    (
                                        <>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>


                                                <input
                                                    type="text"
                                                    placeholder="ChatName"
                                                    name="chatName"

                                                    value={updategroupName}
                                                    onChange={(e) => {
                                                        setUpdateGroupName(e.target.value)
                                                    }}

                                                />
                                                <button type="submit" style={{}} onClick={handleRename}>
                                                    Update
                                                </button>
                                            </div>

                                            <input
                                                className='input-users'
                                                type="text"
                                                placeholder="Add Users to group"
                                                name="users"
                                                value={search}
                                                onChange={(e) => {
                                                    handleSearch(e.target.value)
                                                }}

                                            />
                                        </>
                                    )}

                                {serachResult.map((user) => (
                                    <div
                                        key={user._id}
                                        className="nav-link-chatpage"
                                        onClick={() => handleAdduser(user)}
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
                                ))}

                            </>
                        )}
                        <button type="submit" style={{ backgroundColor: "red", margin: "10px", marginLeft: "15px" }} onClick={() => handleRemove(userData)}>
                            Leave Group
                        </button>
                    </div>

                </div>
            )}

        </div>
    )
}

export default UpdateGroup