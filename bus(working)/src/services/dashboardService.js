import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:8000/api";

// Create axios instance with auth header
const createAuthHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Get today's booking statistics
export const getTodayBookings = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/stats/bookings`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    throw error;
  }
};

// Get today's cancellation statistics
export const getTodayCancellations = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/stats/cancellations`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching cancellation stats:", error);
    throw error;
  }
};

// Get agent booking statistics
export const getAgentBookingStats = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/stats/agents`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching agent stats:", error);
    throw error;
  }
};

// Get staff statistics
export const getStaffStats = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/stats/staff`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching staff stats:", error);
    throw error;
  }
};

// Get all dashboard statistics in one call
export const getAllDashboardStats = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/stats/all`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all dashboard stats:", error);
    throw error;
  }
};

// Get monthly revenue statistics
export const getMonthlyRevenue = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/revenue/monthly`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    throw error;
  }
};

// Get daily revenue statistics
export const getDailyRevenue = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/revenue/daily`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching daily revenue:", error);
    throw error;
  }
};

// Get yearly revenue statistics
export const getYearlyRevenue = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/revenue/yearly`,
      createAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching yearly revenue:", error);
    throw error;
  }
};
