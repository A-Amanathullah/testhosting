import axios from '../utils/axiosConfig';
import { getToken } from '../utils/auth';

const API_URL = '/api';

// Helper function to get headers with authorization
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const agentCommissionService = {
  // Get all agent commissions
  getAll: () => {
    return axios.get(`${API_URL}/agent-commissions`, getAuthHeaders());
  },

  // Get specific agent commission
  getById: (id) => {
    return axios.get(`${API_URL}/agent-commissions/${id}`, getAuthHeaders());
  },

  // Get agent commission by user ID
  getByUserId: (userId) => {
    return axios.get(`${API_URL}/agent-commissions/user/${userId}`, getAuthHeaders());
  },

  // Create new agent commission
  create: (commissionData) => {
    return axios.post(`${API_URL}/agent-commissions`, commissionData, getAuthHeaders());
  },

  // Update agent commission
  update: (id, commissionData) => {
    return axios.put(`${API_URL}/agent-commissions/${id}`, commissionData, getAuthHeaders());
  },

  // Delete agent commission
  delete: (id) => {
    return axios.delete(`${API_URL}/agent-commissions/${id}`, getAuthHeaders());
  },

  // Initialize default commissions for all agents
  initializeCommissions: () => {
    return axios.post(`${API_URL}/agent-commissions/initialize`, {}, getAuthHeaders());
  },

  // Calculate commission for a booking
  calculateCommission: (userId, bookingPrice) => {
    return axios.post(`${API_URL}/agent-commissions/calculate`, {
      user_id: userId,
      booking_price: bookingPrice
    }, getAuthHeaders());
  }
};

export default agentCommissionService;
