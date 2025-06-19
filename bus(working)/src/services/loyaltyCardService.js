import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const createLoyaltyCard = async (card) => {
  // Map frontend fields to backend fields
  const payload = {
    tier: card.tier,
    min_points: card.points?.min ?? card.minPoints,
    max_points: card.points?.max ?? card.maxPoints,
    points_per_booking: card.pointsPerBooking || null,
    color: card.color,
  };
  const res = await axios.post(`${API_URL}/loyalty-cards`, payload);
  return res.data;
};

export const updateLoyaltyCard = async (id, card) => {
  // Map frontend fields to backend fields
  const payload = {
    tier: card.tier,
    min_points: card.min_points ?? card.minPoints,
    max_points: card.max_points ?? card.maxPoints,
    points_per_booking: card.points_per_booking ?? card.pointsPerBooking,
    color: card.color,
  };
  const res = await axios.put(`${API_URL}/loyalty-cards/${id}`, payload);
  return res.data;
};

export const getLoyaltyCards = async () => {
  const res = await axios.get(`${API_URL}/loyalty-cards`);
  return res.data;
};

export const deleteLoyaltyCard = async (id) => {
  const res = await axios.delete(`${API_URL}/loyalty-cards/${id}`);
  return res.data;
};
