import React, { useState, useEffect } from "react";
import "../assets/css/home.css"
const Home = () => {
  useEffect(()=>{
    document.title="Home"  
    },[])
  return (
    <div className="home-page">
      <h2 className="home-head">
        Hello and Welcome! Find Your Favorites at ...
      </h2>
    </div>
  );
};

export default Home;
