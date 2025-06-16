import React from "react";
import gl from "../../assets/google.svg";
import { useLocation } from "react-router-dom";

// Update this URL to your backend's Google OAuth redirect endpoint
const GOOGLE_AUTH_URL = "http://localhost:8000/api/auth/google/redirect";

const GoogleAuthButton = ({ className = "" }) => {
  const location = useLocation();
  // Pass the current path as 'from' param
  const from = encodeURIComponent(location.state?.from?.pathname || location.pathname || "/");
  const url = `${GOOGLE_AUTH_URL}?from=${from}`;
  return (
    <a
      href={url}
      className={`w-full border border-gray-300 text-md p-2 rounded-lg mb-4 sm:mb-6 hover:text-primary hover:border-primary flex items-center justify-center ${className}`}
    >
      <img src={gl} alt="Google" className="w-6 h-6 inline mr-2" />
      Create with Google
    </a>
  );
};

export default GoogleAuthButton;
