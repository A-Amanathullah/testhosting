import axios from 'axios';
import { createGuestBooking, getAgentGuestBookings } from './guestBookingService';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Get all agents
export const getAgents = async () => {
  try {
    const response = await axios.get(`${API_URL}/agents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

// Get bookings made by a specific agent
export const getAgentBookings = async (agentId) => {
  try {
    // Use the guestBookingService instead
    const response = await getAgentGuestBookings(agentId);
    return response.data;
  } catch (error) {
    console.error('Error fetching agent bookings:', error);
    throw error;
  }
};

// Create a guest booking with agent_id
export const createAgentBooking = async (bookingData) => {
  try {
    // Use the guestBookingService instead
    const response = await createGuestBooking(bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating agent booking:', error);
    throw error;
  }
};
