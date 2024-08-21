import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewStoryModal from './ViewStoryModal';
import { useSelector } from 'react-redux';

const Story = () => {
  const [storyModal, setStoryModal] = useState(false);
  const [story, setStory] = useState('');
  const [viewStory, setviewStory] = useState(false);
  const [image, setImage] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState([]);
  const userData = useSelector((state) => state.user.userData);
  const [selectedUser, setSelectedUser] = useState({});
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const handleStoryModal = () => {
    setStoryModal(!storyModal);
  };


  const onFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const createStory = async () => {
    if (!image) {
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/user/api/addstory', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwttoken')}`, // Include token if needed
        },
      });

      if (!response.ok) {
        throw new Error('Error creating story.');
      }

      const result = await response.json();
      setStory(result)
      setImage(null);
      handleStoryModal();
    } catch (err) {
      console.log(err);
    }
  };



  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('http://localhost:5000/user/api/getstory', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwttoken')}`, // Include token if needed
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching stories.');
        }
        const result = await response.json();
        setAllStories(result.allStories);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchStories();
  }, [story._id]);


  const openStoryModal = async (user) => {
    const userStories = allStories.find(story => story.user._id === user._id);
    setSelectedStory(userStories.stories);
    setSelectedUser(user);
    setviewStory(true);
    try {
      if (userStories && userStories.stories.length > 0) {
        await Promise.all(userStories.stories.map(async (story) => {
          if (story._id) {
            const response = await fetch(`http://localhost:5000/user/api/updateViewers/${story._id}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwttoken')}`, // Include token if needed
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              throw new Error('Error updating viewers.');
            }

            const result = await response.json();

            console.log('Viewers updated for story:', story._id, result);
          }
        }));
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };




  return (
    <div>
      <div className="container mt-4" style={{ border: "1px solid #c5c0c09e", background: "white", width: "500px", padding: "10px 2px 0px 2px", overflow: "hidden" }}>
        <div className="story-card">
          <ul className="list-inline d-flex align-items-center mb-0">
            <li className="list-inline-item mx-2">
              <button className="btn p-0" onClick={handleStoryModal}>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center story-avatar " style={{ border: "1px solid black" }}>
                    <div
                      className=""
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                      onClick={handleStoryModal}
                    /><i className="bi bi-plus-circle-fill" style={{ position: "absolute" }}></i>
                  </div>
                  <p className="mt-2 text-center" style={{ fontSize: '12px', color: '#333' }}>Add Story</p>
                </div>
              </button>
            </li>

            {allStories.map((userStories, index) => (
              <li className="list-inline-item mx-2" key={index}>
                <button className="btn p-0" onClick={() => openStoryModal(userStories.user)}>
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className=" rounded-circle overflow-hidden d-flex justify-content-center align-items-center story-avatar">
                      <img
                        src={`http://localhost:5000/images/${userStories.user.profileImage}`}
                        className=""
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    {userStories.user._id === userData._id ? <p className="mt-2 text-center" style={{ fontSize: '12px', color: '#333' }}>My story</p> : <p className="mt-2 text-center" style={{ fontSize: '12px', color: '#333' }}>{userStories.user.name}</p>}

                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`modal fade ${storyModal ? 'show' : ''}`} style={{ display: storyModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Story</h5>
              <button type="button" className="btn-close" onClick={handleStoryModal}></button>
            </div>
            <div className="modal-body">
              <input type="file" className="form-control mb-3" accept="image/*" onChange={onFileChange} />
              {image && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleStoryModal}>Close</button>
              {image && (
                <button type="button" className="btn btn-primary" onClick={createStory}>Post Story</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {storyModal && <div className="modal-backdrop fade show" onClick={handleStoryModal}></div>}

      {/* View story modal */}
      <ViewStoryModal
        viewStory={viewStory}
        setviewStory={setviewStory}
        stories={selectedStory}
        profileImage={selectedUser.profileImage}
        username={selectedUser.name}
        currentStoryIndex={currentStoryIndex}
        setCurrentStoryIndex={setCurrentStoryIndex}
      />
    </div>
  );
};

export default Story;
