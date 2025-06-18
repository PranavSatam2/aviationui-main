import React from 'react';
import { Navigate,Routes,  Route } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';

// Utility function to get roles from the JWT token
const getUserRoles = () => {
  const token = sessionStorage.getItem("jwt_token");
  if (token) {
    const decodedToken = jwt_decode(token);
    return decodedToken.roles || [];
  }
  return [];
};

const PrivateRoute = ({ element, requiredRoles, ...rest }) => {
  const userRoles = getUserRoles();
  const isAuthenticated = sessionStorage.getItem("jwt_token") !== null;

  // Check if user is authenticated and has at least one required role
  const hasPermission = requiredRoles.some(role => userRoles.includes(role));

  if (!isAuthenticated || !hasPermission) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;
