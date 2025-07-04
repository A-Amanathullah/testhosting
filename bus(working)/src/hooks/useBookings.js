import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Add userId as an optional 3rd parameter
const useBookings = (bus_id, date, userIdOrRefreshKey) => {
  const [bookings, setBookings] = useState([]);
  const [frozenSeats, setFrozenSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define fetchBookings as a reusable function
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // If all arguments are empty, fetch all bookings
      if (!bus_id && !date && !userIdOrRefreshKey) {
        const res = await axios.get(`${API_URL}/bookings`);
        const allBookings = res.data || [];
        setBookings(
          allBookings.filter(
            (b) => String(b.status).toLowerCase() !== "freezed"
          )
        );
        setFrozenSeats(
          allBookings.filter((b) => String(b.status).toLowerCase() === "freezed")
        );
        return;
      }
      // If userId is provided and bus_id/date are not, fetch all bookings for user
      if ((!bus_id || !date) && userIdOrRefreshKey) {
        const res = await axios.get(`${API_URL}/bookings`, {
          params: { user_id: userIdOrRefreshKey },
        });
        const allBookings = res.data || [];
        setBookings(
          allBookings.filter(
            (b) => String(b.status).toLowerCase() !== "freezed"
          )
        );
        setFrozenSeats(
          allBookings.filter((b) => String(b.status).toLowerCase() === "freezed")
        );
        return;
      }
      // If bus_id is provided and date is not, fetch all bookings for that bus
      if (bus_id && !date) {
        const res = await axios.get(`${API_URL}/bookings`, { params: { bus_id } });
        const allBookings = res.data || [];
        setBookings(
          allBookings.filter(
            (b) => String(b.status).toLowerCase() !== "freezed"
          )
        );
        setFrozenSeats(
          allBookings.filter((b) => String(b.status).toLowerCase() === "freezed")
        );
        return;
      }
      // If neither bus_id/date nor userId, clear
      if (!bus_id || !date) {
        setBookings([]);
        setFrozenSeats([]);
        return;
      }
      // If bus_id and date are provided, fetch bookings for that bus and date
      const res = await axios.get(`${API_URL}/bookings`, {
        params: { bus_id, departure_date: date },
      });
      const allBookings = res.data || [];
      setBookings(
        allBookings.filter(
          (b) => String(b.status).toLowerCase() !== "freezed"
        )
      );
      setFrozenSeats(
        allBookings.filter((b) => String(b.status).toLowerCase() === "freezed")
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [bus_id, date, userIdOrRefreshKey]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, frozenSeats, loading, error, fetchBookings };
};

export default useBookings;
