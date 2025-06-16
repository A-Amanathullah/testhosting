import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    // Optionally, render a loading spinner or null while checking auth state
    return null;
  }

  if (!user) {
    // Save current location and send to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If user does not have the required role, redirect to home or unauthorized page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
