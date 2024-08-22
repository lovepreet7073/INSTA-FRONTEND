import React, { useState, useEffect } from 'react';
import Stories from 'react-insta-stories';
import formatShortDate from '../functions/formatDate';
import { useSelector } from 'react-redux';


const ViewStoryModal = ({ setviewStory,viewStory, stories, profileImage, username, currentStoryIndex, setCurrentStoryIndex }) => {
  const userData = useSelector((state) => state.user.userData);
  const [viewersListVisible, setViewersListVisible] = useState(false);
  const storyItems = stories && stories.map(storyItem => ({
    url: `${process.env.REACT_APP_API_BASE_URL}/images/${storyItem.image}`,
    header: {
      heading: username,
      subheading: `${formatShortDate(storyItem.createdAt)}`,
      profileImage: `${process.env.REACT_APP_API_BASE_URL}/images/${profileImage}`,
    },

  }))
  const customStoryStyles = {
    width: '100%', 
    height: '100%', 
    objectFit: 'contain', 
    position:"absolute",
    top:"0px"
  };
  
  const handleStoryViewModal = () => {
    setviewStory(!viewStory);
    setViewersListVisible(false)
  };

  const handleViewersListToggle = () => {
    setViewersListVisible(!viewersListVisible);
  };


  useEffect(() => {
    console.log(`Current story index is: ${currentStoryIndex}`);
  }, [currentStoryIndex]);

  const isStoryCreator = userData._id === stories[0]?.postedBy?._id;
  console.log(stories);
  console.log('Viewers:', currentStoryIndex, stories);
  return (
    <div>
      {viewStory && (
        <div className={`modal fade ${viewStory ? 'show' : ''}`} style={{ display: viewStory ? 'block' : 'none' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body modal-bottom" style={{ height: "auto"}}>
                <i class="bi bi-x-lg" onClick={handleStoryViewModal} style={{cursor:"pointer"}}></i>
                {storyItems && storyItems.length > 0 ? (
                  <div>
                    <Stories
                      className="stories"
                      stories={storyItems}
                      defaultInterval={5000}    
                      width={470}
                      height={419}
                      loop
                      onStoryStart={(index) => setCurrentStoryIndex(index)}
                      onStoryChange={(index) => {
                        setCurrentStoryIndex(index);
                      }}
                      storyStyles={customStoryStyles}
                    />
                      {viewersListVisible && isStoryCreator && (
                      <div >
                        {stories[currentStoryIndex]?.viewers.length > 0 ? (
                          <ul className="list-group">
                            {stories[currentStoryIndex].viewers
                              .map((viewer, index) => (
                                <li className="list-group-item" key={index} style={{color:"white",background:"#37323257",border:"none"}}>
                                  <img
                                    src={`${process.env.REACT_APP_API_BASE_URL}/images/${viewer.profileImage}`}
                                    alt={viewer.username}
                                    className="rounded-circle"
                                    style={{ width: '30px', height: '30px', marginRight: '10px' }}
                                  />
                                  {viewer.name}
                                </li>
                              ))
                            }
                          </ul>
                        ) : (
                          <p>No viewers yet</p>
                        )}
                      </div>
                    )}
                    {isStoryCreator && (
                      <div style={{ cursor: 'pointer' }} className='eye-count' onClick={handleViewersListToggle}>
                        <i className="bi bi-eye" style={{ fontSize: "20px" }}></i> {stories[currentStoryIndex]?.viewers.length}
                      </div>
                    )}
                   
                  </div>
                ) : (
                  <p>No stories available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {viewStory && <div className="modal-backdrop fade show" onClick={handleStoryViewModal}></div>}
    </div>
  );
};

export default ViewStoryModal;
