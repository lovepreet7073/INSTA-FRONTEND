// import React, { useEffect, useState } from 'react';
// import "../assets/css/videocall.css";
// import { endCall } from "../Reducer/callReducer";
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";
// import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
// const Videocall = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const ENDPOINT = "http://localhost:5000";
//   const userData = useSelector((state) => state.user.userData);
//   var socket = io(ENDPOINT);
//   const [callAccept, setCallAccept] = useState(false);
//   const [token, setToken] = useState(undefined);
//   const [localStream, setlocalStream] = useState(undefined);
//   const [publishStream, setpublishStream] = useState(undefined);
//   const [zgVar, setZgVar] = useState(undefined);
//   const { type, user, roomId } = useSelector((state) => state.call.videoCall);

//   const endcallfunction = () => {
//     // dispatch(endCall())
//     navigate("/chatpage")
//   }


//   useEffect(() => {
//     if (zgVar && localStream && publishStream) {
//       zgVar.destroyStream(localStream);
//       zgVar.stopPublishingStream(publishStream);
//       zgVar.logoutRoom(roomId, toString())

//     }

//     else {
//       setTimeout(() => {
//         setCallAccept(true);
//       }, 1000);
//     }
//     // dispatch(endCall());
//   },[]);

//   useEffect(() => {

//     const generateToken = async () => {
//       const tokenEndpoint = `http://localhost:5000/user/api/generate-token/${userData._id}`;
      
//       try {
//         const response = await fetch(tokenEndpoint, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to generate token");
//         }

//         const data = await response.json();
//         const { token } = data;
//         console.log(token,'tokennnn')
//         setToken(token);
//       } catch (error) {
//         console.error("Error generating token:", error);
//         throw error;
//       }
//     };
//     generateToken();
//   }, [callAccept])

//   useEffect(() => {
//     const startCall = async () => {

//       const zegoAppID = parseInt(process.env.REACT_APP_ZEGO_APP_ID);
//       const zegoServer = process.env.REACT_APP_ZEGO_SERVER_ID;
//       const zg = new ZegoExpressEngine(zegoAppID, zegoServer);

//       setZgVar(zg);
//       zg.on(
//         "roomStreamUpdate", async (roomID, updateType, streamList, extendeddata) => {
//           if (updateType === "ADD") {
//             const videorm = document.getElementById("remote-video");
//             const vd = document.createElement("video");
//             vd.id = streamList[0].streamID;
//             vd.autoplay = true;
//             vd.playsInline = true;
//             vd.muted = false;
//             if (videorm) {
//               videorm.appendChild(vd);
//             }
//             zg.startPlayingStream(streamList[0].streamID, {
//               audio: true,
//               video: true
//             }).then((stream) => (vd.srcObject = stream));
//           } else if (updateType === "DELETE" && zg && localStream && streamList[0].streamID) {
//             zg.destroyStream(localStream);
//             zg.stopPublishingStream(streamList[0].streamID);
//             zg.logoutRoom(roomId.toString());
//             // dispatch(endCall());
//           }
//         })
//       await zg.loginRoom(roomId.toString(), token, { userID: userData._id.toString(), userName: userData.name },
//         { userUpdate: true });
//       const localStream = await zg.createStream({
//         camera: {
//           audio: true,
//           video: true
//         },
//       });
//       const localVideo = document.getElementById("local-video");
//       const videoElement = document.createElement("video");

//       videoElement.id = "video-local-zego";
//       videoElement.className = "zego-local-class";
//       videoElement.autoplay = true;
//       videoElement.muted = false;
//       videoElement.playsInline = true;
//       localVideo.appendChild(videoElement);
//       const td = document.getElementById("video-local-zego");
//       td.srcObject = localStream;
//       const streamID = '123' + Date.now();
//       setpublishStream(localStream);
//       zg.stopPublishingStream(streamID, localStream);
//     }


//     if (token) {
//       startCall();
//     }
//   }, [token])


//   return (
//     <div className='videocall-page'>
//       <div className='section'>

//         <h2 style={{ margin: "0px" }}> {user.name}</h2>
//         <span>      <p style={{ fontSize: "11px" }}>{callAccept && type === 'outgoing' ? 'On going call' : 'calling'}</p></span>
//         <div className='img-section'>

//           <img src={`http://localhost:5000/images/${user.image}`} alt={`${user.name}'s profile`} />
//           <div className='video-ui' id='remote-video'>
//             <div className='local-video'>

//             </div>
//           </div>
//         </div>

//         <button className='endcall' onClick={endcallfunction}>End Call</button>
//       </div>
//     </div>
//   )
// }


// export default Videocall;
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
      style={{ width: '100vw', height: '100vh' }}
    ></div>

  )
}

export default Videocall