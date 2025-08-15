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

export const removeAgentMembers = async () => {
  const res = await axios.post(`${API_URL}/loyalty-members/remove-agents`);
  return res.data;
};
