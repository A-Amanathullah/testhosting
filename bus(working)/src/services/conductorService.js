import axios from "../utils/axiosConfig";
import { getToken } from "../utils/auth";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

/**
 * Get all trips assigned to the logged-in conductor
 */
export const getConductorTrips = async () => {
  try {
    const response = await axios.get(`${API_URL}/conductor/trips`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conductor trips:', error);
    throw error;
  }
};

/**
 * Get today's trips for the logged-in conductor
 */
export const getConductorTodayTrips = async () => {
  try {
    const response = await getConductorTrips();
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
    // Filter trips for today
    const todayTrips = response.trips.filter(trip => {
      const tripDate = new Date(trip.departure_date).toISOString().split('T')[0];
      return tripDate === today;
    });
    
    return {
      ...response,
      trips: todayTrips,
      today_trips_count: todayTrips.length
    };
  } catch (error) {
    console.error('Error fetching conductor today trips:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific trip
 */
export const getConductorTripDetails = async (tripId) => {
  try {
    const response = await axios.get(`${API_URL}/conductor/trip/${tripId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trip details:', error);
    throw error;
  }
};
