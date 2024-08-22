import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { endCall } from '../reducer/callReducer'; // Import endCall action
import { io } from 'socket.io-client';
const Videocall = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const userID = userData._id;
  const socketRef = useRef(); 
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_BASE_URL);
    socketRef.current = socket;
    socket.on('endCall', () => {
    dispatch(endCall()); 
    navigate('/chatpage');
    });
    }, []);

  const myMeeting = (element) => {
    const appID = 1054182549;
    const serverSecret = "43ee572c3865f91aed555adc6149ad7d";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(), userID.toString());
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      showPreJoinView: false,
      showLeavingView:false,
      showLeaveRoomConfirmDialog:false,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      onLeaveRoom: () => {
        notifyOtherUserToEndCall(roomID);

      },
      onUserLeave: () => {
        notifyOtherUserToEndCall(roomID);
      }
    });
  };

  const notifyOtherUserToEndCall = (roomID) => {
    socketRef.current.emit('endCall', { roomID });
    dispatch(endCall())
    navigate('/chatpage');
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
    // style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
};

export default Videocall;