import React, {  useEffect } from "react";
import "../assets/css/home.css"
const Home = () => {
  useEffect(()=>{
    document.title="Home"  
    },[])
  return (
    <div className="home-page" style={{display:"flex",alignItems:"center",gap:"25px",marginLeft:"26%"}}>
      <h1 className="home-head">
        Hello and Welcome! <br/>
        Find Your Favorites at 
        <br/>TalkPost...
      </h1>
      <img className="home-img" src="https://www.mckinsey.com/~/media/mckinsey/featured%20insights/mckinsey%20explainers/what%20is%20social%20media/what%20is%20social%20media__1407795145_hero_1536x864.jpg?cq=50&mw=767&cpy=Center"/>
    </div>
  );
};

export default Home;
