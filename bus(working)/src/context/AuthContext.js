import { createContext, useState, useEffect } from "react";
import { fetchUser, setupAxiosInterceptors } from "../services/authService";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptors(setUser, navigate);
    const token = getToken();
    setToken(token);
    if (token) {
      fetchUser()
        .then(userData => {
          setUser(userData);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching user:', err);
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [ navigate ]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};