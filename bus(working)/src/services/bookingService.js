import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const createBooking = async (bookingData, token) => {
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
