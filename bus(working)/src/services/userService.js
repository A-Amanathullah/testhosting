import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:8000/api";

export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const createUser = async (user, userDetails) => {
  // Create user
  const response = await axios.post(`${API_URL}/admin/create-user`, user, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const createdUser = response.data.user;
  // Create user details
  const detailsPayload = { ...userDetails, user_id: createdUser.id, email: createdUser.email, role: createdUser.role };
  await axios.post(`${API_URL}/user-details`, detailsPayload, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  // Return combined user and details
  return { ...createdUser, ...detailsPayload };
};

export const updateUser = async (id, user, userDetails) => {
  // Update user details
  const detailsPayload = { ...userDetails, user_id: id, email: user.email, role: user.role };
  const response = await axios.post(`${API_URL}/user-details`, detailsPayload, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return { id, ...user, ...response.data.user_detail };
};

export const deleteUser = async (id) => {
  // Delete user by ID
  const response = await axios.delete(`${API_URL}/user/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};
