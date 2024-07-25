// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
