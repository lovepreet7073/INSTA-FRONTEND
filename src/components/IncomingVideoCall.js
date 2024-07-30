import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearIncomingCall } from "../Reducer/callReducer";

const IncomingVideoCall = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const incomingCall = useSelector((state) => state.call.incomingCall);
  console.log(incomingCall, "call");
  if (!incomingCall) {
    return null;
  }

  const acceptCall = () => {
    dispatch(clearIncomingCall());
    navigate(`/videocall/${incomingCall.roomID}`);
  };

  const rejectCall = () => {
    dispatch(clearIncomingCall());
  };

  return (
    <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 end-0 bottom-0 bg-light bg-opacity-75">
      <div
        className="card"
        style={{
          width: "20rem",
          padding: "18px",
          border: "1px solid lightgrey",
          alignItems:"center",
          background:"white"
        }}
      >
        {incomingCall.profileImage ? (
             <img   src={`http://localhost:5000/images/${incomingCall.profileImage}`}style={{ width: "200px" }} />
        ) : (
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfJOBAjQ_afGxSZJSGrwQxg-tPfSaOP7igrlhwdRbqiresPfdoq_YoDSzWu90PH4Mw-Pw&usqp=CAU"
            className="card-img-top"
            alt="Caller"
            style={{ width: "200px" }}
          />
        )}
        <div className="card-body text-center">
          <h5 className="card-title">{incomingCall.from.name}</h5>
          <p className="card-text">Incoming Video Call</p>
          <button className="btn btn-success me-2" onClick={acceptCall}>
            Accept 
          </button>
          <button className="btn btn-danger" onClick={rejectCall}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingVideoCall;
