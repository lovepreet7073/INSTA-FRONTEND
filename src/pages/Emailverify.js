import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Img from '../assets/images/successEmail.png';
import "../assets/css/emailverify.css";

const Emailverify = () => {
  const [validUrl, setValidUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const { id, token } = useParams();
  useEffect(() => {
    if (id && token) {
      const verifyEmailUrl = async () => {

        try {
          const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/verifyaccount/${id}/${token}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          console.log(res,"response")
          setLoading(false)
          if (res.status === 200) {
            setValidUrl(true);

          } else {
            setValidUrl(false);
          }
        } catch (error) {
          console.error("Verification error:", error);
          setValidUrl(false);
        }
      };

      verifyEmailUrl();
    }
  }, [id,token]);

  if (loading) {
    return (
      <h4>Loading.....</h4>
    )
  }
  return (
    <div className='section bg-light'>
      {validUrl ? (
        <div className='email-container'>
          <img src={Img} alt='Email Verification Success' />
          <h1>Email verified successfully</h1>
          <NavLink to="/login">
            <button className='btn-register  btn btn-primary'>Log In</button>
          </NavLink>
        </div>
      ) : (
        <div className='invalid-sec'>
          <h1>Invalid token </h1>
          <p className="">
         <NavLink to="/resend-confirmation" className="link">
         <button className='btn-register  btn btn-primary'>Resend</button>
            </NavLink>
          </p>
        </div>
      )}
    </div>
  );
};

export default Emailverify;
