import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.css";
import "../assets/css/footer.css";
const Footer = () => {
  const userData = useSelector((state) => state.user.userData);
  const isAuthorized =
    localStorage.getItem("jwttoken") && Object.keys(userData).length > 0;

  return (
    <div className="footer">
<p>
© 2024 Instagram from Meta
</p>
    </div>
  );
};

export default Footer;
