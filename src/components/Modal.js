import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { openChat } from "../Reducer/chatReducer";
const Modal = ({ fetchChats, isModalOpen, setIsModalOpen, setFetchAgain }) => {
  const [search, setSearch] = useState('');
  const [serachResult, setSerachResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const ENDPOINT = "http://localhost:5000";
  var socket = io(ENDPOINT);
  const dispatch = useDispatch();

  const modelSchema = Yup.object().shape({
    chatName: Yup.string().required('Enter Chat Name!'),
    users: Yup.string().required('Add users for create group!'),
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSearch = async (event) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
    if (searchTerm === '') {
      setSerachResult([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/users?search=${searchTerm}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
          },
        }
      );
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



  const formik = useFormik({
    initialValues: {
      chatName: '',
      users: '',
    },
    validationSchema: modelSchema,
    onSubmit: async (values) => {
      if (selectedUsers.length < 2) {
        formik.setFieldError("users", "Add at least two users to create a group");
        return;
      }
      const formData = {
        chatName: values.chatName,
        users: JSON.stringify(selectedUsers.map(user => user._id)),
      };

      try {
        const response = await fetch('http://localhost:5000/user/api/creategroup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwttoken')}`,
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const newGroupChat = await response.json();
          setFetchAgain(newGroupChat);
          dispatch(openChat(newGroupChat));
          socket.emit("create group", newGroupChat._id, newGroupChat.users);
          setIsModalOpen(false);
          fetchChats()
        } else {
          throw new Error('Error creating group');
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    },
  });


  const handleRemove = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deleteUser._id));

  };

  const handleselectedusers = (userToAdd) => {
    if (!selectedUsers.some((user) => user._id === userToAdd._id)) {
      setSelectedUsers([...selectedUsers, userToAdd]);
      setSearch('');
      setSerachResult([]);
    } else {
      formik.setFieldError("users", "user already added!");
    }
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <h2>Create New Group Chat</h2>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {selectedUsers.map((u) => (
                <div key={u._id} className="selected-user">
                  <h6>{u.name}</h6>
                  <span style={{ cursor: 'pointer' }} onClick={() => handleRemove(u)}>
                    &times;
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={formik.handleSubmit}>
              <input
                type="text"
                placeholder="Chat Name"
                name="chatName"
                value={formik.values.chatName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.chatName && formik.errors.chatName && (
                <p className="group-create-msg" >{formik.errors.chatName}</p>
              )}
              <input
                type="text"
                placeholder="Add users eg: John, Priya, Jane"
                name="users"
                value={search}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleSearch(e);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.users && formik.errors.users && (
                <p className="group-create-msg">{formik.errors.users}</p>
              )}
              <button type="submit" disabled={formik.isSubmitting}>
                Create Chat
              </button>
            </form>
            {serachResult.map((user) => (
              <div
                key={user._id}
                className="nav-link-chatpage"
                onClick={() => handleselectedusers(user)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
