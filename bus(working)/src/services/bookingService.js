import axios from "axios";
import { formatDateForMySQL } from "../utils/dateUtils";

const API_URL = "http://localhost:8000/api";

export const createBooking = async (bookingData, token) => {
  // Ensure departure_date is in the correct format
  if (bookingData.departure_date) {
    bookingData = {
      ...bookingData,
      departure_date: formatDateForMySQL(bookingData.departure_date),
    };
  }

  console.log("Creating booking with formatted data:", bookingData);

  return axios.post(`${API_URL}/bookings`, bookingData, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const updateBookingStatus = async (updateData, token) => {
  // You may want to update by serial_no or booking id, adjust endpoint as needed
  return axios.patch(`${API_URL}/bookings/update-status`, updateData, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export const deleteBooking = async (bookingId, token) => {
  return axios.delete(`${API_URL}/bookings/${bookingId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
