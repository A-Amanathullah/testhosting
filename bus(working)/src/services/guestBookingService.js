import axios from "axios";
import { formatDateForMySQL } from "../utils/dateUtils";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

/**
 * Create a new guest booking with properly formatted departure_date
 * @param {Object} bookingData - The booking data to create
 * @returns {Promise} - API response
 */
export const createGuestBooking = async (bookingData) => {
  // Ensure departure_date is in the correct format for MySQL
  if (bookingData.departure_date) {
    bookingData = {
      ...bookingData,
      departure_date: formatDateForMySQL(bookingData.departure_date),
    };
  }

  return axios.post(`${API_URL}/guest-bookings`, bookingData);
};

/**
 * Update an existing guest booking with properly formatted departure_date
 * @param {number} bookingId - The ID of the booking to update
 * @param {Object} bookingData - The updated booking data
 * @returns {Promise} - API response
 */
export const updateGuestBooking = async (bookingId, bookingData) => {
  // Ensure departure_date is in the correct format for MySQL
  if (bookingData.departure_date) {
    bookingData = {
      ...bookingData,
      departure_date: formatDateForMySQL(bookingData.departure_date),
    };
  }

  return axios.put(`${API_URL}/guest-bookings/${bookingId}`, bookingData);
};

/**
 * Cancel a guest booking
 * @param {number} bookingId - The ID of the booking to cancel
 * @returns {Promise} - API response
 */
export const cancelGuestBooking = async (bookingId) => {
  return axios.post(`${API_URL}/guest-bookings/${bookingId}/cancel`);
};

/**
 * Delete a guest booking (for temporary/processing bookings that are abandoned)
 * @param {number} bookingId - The ID of the booking to delete
 * @returns {Promise} - API response
 */
export const deleteGuestBooking = async (bookingId) => {
  return axios.delete(`${API_URL}/guest-bookings/${bookingId}`);
};

/**
 * Get guest bookings for a bus and date
 * @param {number|string} busIdentifier - The bus ID or bus number to filter by
 * @param {string} date - The departure date to filter by
 * @returns {Promise} - API response
 */
export const getGuestBookings = async (busIdentifier, date) => {
  // Format the date for MySQL if provided
  const formattedDate = date ? formatDateForMySQL(date) : date;
  
  // Create params object with flexible bus matching
  const params = {};
  
  // Add date if provided
  if (formattedDate) {
    params.departure_date = formattedDate;
  }
  
  // Add bus identifier - try both bus_id and bus_no for flexibility
  if (busIdentifier) {
    // If it's a number, assume it's bus_id, otherwise assume it's bus_no
    if (typeof busIdentifier === 'number' || /^\d+$/.test(busIdentifier)) {
      params.bus_id = busIdentifier;
    } else {
      params.bus_no = busIdentifier;
    }
  }
  
  return axios.get(`${API_URL}/guest-bookings`, { params });
};

/**
 * Get guest bookings made by a specific agent
 * @param {number} agentId - The agent ID to filter by
 * @returns {Promise} - API response
 */
export const getAgentGuestBookings = async (agentId) => {
  return axios.get(`${API_URL}/guest-bookings/agent/${agentId}`);
};

/**
 * Get available agents for bookings
 * @returns {Promise} - API response with list of agents
 */
export const getAvailableAgents = async () => {
  return axios.get(`${API_URL}/guest-bookings/agents`);
};
