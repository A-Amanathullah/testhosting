import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const getLoyaltyMembers = async (page = 1) => {
  const res = await axios.get(`${API_URL}/loyalty-members?page=${page}`);
  return res.data;
};

export const getLoyaltyMember = async (id) => {
  const res = await axios.get(`${API_URL}/loyalty-members/${id}`);
  return res.data;
};

export const createMembersForAllUsers = async () => {
  const res = await axios.post(`${API_URL}/loyalty-members/create-all`);
  return res.data;
};

export const createMemberForUser = async (userId) => {
  const res = await axios.post(`${API_URL}/loyalty-members/create-for-user`, {
    user_id: userId
  });
  return res.data;
};

export const refreshAllMembersData = async () => {
  const res = await axios.post(`${API_URL}/loyalty-members/refresh-all`);
  return res.data;
};

export const refreshMemberData = async (id) => {
  const res = await axios.post(`${API_URL}/loyalty-members/${id}/refresh`);
  return res.data;
};

export const updateMemberStatus = async (id, isActive) => {
  const res = await axios.patch(`${API_URL}/loyalty-members/${id}/status`, {
    is_active: isActive
  });
  return res.data;
};

export const getLoyaltyStatistics = async () => {
  const res = await axios.get(`${API_URL}/loyalty-members/statistics`);
  return res.data;
};

export const getLoyaltyReport = async () => {
  const res = await axios.get(`${API_URL}/loyalty-members/report`);
  return res.data;
};

export const deleteLoyaltyMember = async (id) => {
  const res = await axios.delete(`${API_URL}/loyalty-members/${id}`);
  return res.data;
};
