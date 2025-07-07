import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const getRoles = async () => {
  const response = await axios.get(`${API_URL}/roles`);
  // Extract the data array from the response
  return response.data.data || [];
};

export const createRole = async (roleData) => {
  const response = await axios.post(`${API_URL}/roles`, roleData);
  return response.data;
};

export const updateRole = async (id, roleData) => {
  const response = await axios.put(`${API_URL}/roles/${id}`, roleData);
  return response.data;
};

export const deleteRole = async (id) => {
  const response = await axios.delete(`${API_URL}/roles/${id}`);
  return response.data;
};
