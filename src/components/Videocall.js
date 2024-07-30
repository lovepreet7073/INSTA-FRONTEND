
import React from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
const Videocall = () => {

  const {roomID} = useParams();
  const userData = useSelector((state) => state.user.userData);
  const userID = userData._id;
  const myMeeting = (element)=>{
    
    const appID = 1054182549;
    const serverSecret = "43ee572c3865f91aed555adc6149ad7d";
    const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(),userID.toString())
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Meeting link',
          url:`http://localhost3000/videocall/${roomID}`,
          
        },
      ]
      ,
      scenario: {
       mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
 });
};

  
  return (
<div
      className="myCallContainer"
      ref={myMeeting}
      // style={{ width: '100vw', height: '100vh' }}
    ></div>

  )
}

export default Videocall