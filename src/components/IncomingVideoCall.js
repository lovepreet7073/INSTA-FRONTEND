import React from 'react'
import { useSelector, useDispatch } from "react-redux";



const IncomingVideoCall = () => {
const incomingVideoCall = useSelector((state) => state.call.incomingVideoCall);

const acceptCall = ()=>{

}
const rejectCall = ()=>{
    
}
  return (
    <div className=''>
<div className='section-call'>
<div>
    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfJOBAjQ_afGxSZJSGrwQxg-tPfSaOP7igrlhwdRbqiresPfdoq_YoDSzWu90PH4Mw-Pw&usqp=CAU' width="120px" height="120px"/>
    </div>
<div>
        <h2 style={{margin:"0px"}}>henry</h2>


        <p>Incoming Video Call</p>

        <button className='btn-accept'>Accept</button>
        <button className='btn-reject'>Reject</button>

        </div>
</div>
</div>
  )
}

export default IncomingVideoCall;