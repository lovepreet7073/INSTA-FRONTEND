// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwttoken");
  console.log(token,'token')
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
