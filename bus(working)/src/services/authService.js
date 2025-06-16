import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:8000/api";

// Only set up the interceptor once
let interceptorSet = false;
export function setupAxiosInterceptors(setUser, navigate) {
  if (interceptorSet) return;
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
        if (navigate) navigate("/login");
      }
      return Promise.reject(error);
    }
  );
  interceptorSet = true;
}

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

export const fetchUser = async () => {
  const response = await axios.get(`${API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const signupUser = async (name, email, password, role) => {
  const response = await axios.post(`${API_URL}/signup`, {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

export const storeUserDetails = async (userDetails) => {
  const response = await axios.post(`${API_URL}/user-details`, userDetails, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const checkProfileCompletion = async () => {
  const user = await fetchUser();
  return !user.phone_no || !user.gender;
};