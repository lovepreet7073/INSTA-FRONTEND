import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { openChat } from "../Reducer/chatReducer";
const Modal = ({ fetchChats, isModalOpen, setIsModalOpen, setFetchAgain }) => {
  const [search, setSearch] = useState('');
  const [searchResult, setsearchResult] = useState([]);
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
      setsearchResult([]);
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
        setsearchResult(searchData);
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

  const handleSelectedUsers = (userToAdd) => {
    if (!selectedUsers.some((user) => user._id === userToAdd._id)) {
      setSelectedUsers([...selectedUsers, userToAdd]);
      setSearch('');
      setsearchResult([]);
    } else {
      formik.setFieldError("users", "user already added!");
    }
  };

  return (
    <div>
    <div className={`modal fade ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header justify-content-center " style={{gap:"222px"}}>
            <h5 className="modal-title">Create New Group Chat</h5>
            <button type="button" className="close" aria-label="Close" onClick={toggleModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {selectedUsers.map((u) => (
                <div key={u._id} className="selected-user">
                  <h6>{u.name}</h6>
                  <span style={{ cursor: 'pointer' }} onClick={() => handleRemove(u)}>&times;</span>
                </div>
              ))}
            </div>
            <form onSubmit={formik.handleSubmit}>
              
              <div className="input-control">
              
                <input
                  type="text"
                  placeholder="Chat Name" 
                  className="form-control form-control-sm"
                  id="chatName"
                  name="chatName"
                  value={formik.values.chatName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
               
              </div>
              {formik.touched.chatName && formik.errors.chatName && (
                  <p className="err-msg-register">{formik.errors.chatName}</p>
                )}
              <div className="input-control">
            
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Add users e.g. jane,john" 
                  id="users"
                  name="users"
                  value={search}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleSearch(e);
                  }}
                  onBlur={formik.handleBlur}
                />
            
            
              </div>
              {formik.touched.users && formik.errors.users && (
                  <p className="err-msg-register">{formik.errors.users}</p>
                )}
                   {searchResult.map((user) => (
              <div key={user._id} className="nav-link-chatpage" onClick={() => handleSelectedUsers(user)} style={{
              display:"flex",
              alignItems:"center",
              gap:"12px",
              marginTop:"12px",
              cursor:"pointer"
              }}>
                <img
                  src={user.profileImage ? `http://localhost:5000/images/${user.profileImage}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgee_ioFQrKoyiV3tnY77MLsPeiD15SGydSQ&usqp=CAU" }
                  alt={`${user.name}'s profile`}
                  width="40px"
                  height="40px"
                  style={{borderRadius:"50px"}}
                />
                <div className="text">
                  <h6>{user.name}</h6>
                </div>
              </div>
            ))}
              <button type="submit" className="btn btn-primary mt-2" disabled={formik.isSubmitting}>
                Create Chat
              </button>
            </form>
         
          </div>
        </div>
      </div>
    </div>
    <div className={`modal-backdrop fade ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }}></div>
  </div>
  );
};

export default Modal;
