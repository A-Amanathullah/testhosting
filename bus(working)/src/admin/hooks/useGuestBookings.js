import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const useAdminGuestBookings = (busNo, date) => {
  const [guestBookings, setGuestBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGuestBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all guest bookings if busNo and date are not provided
      let params = {};
      if (busNo) params.bus_no = busNo;
      if (date) params.departure_date = date;

      const res = await axios.get(`${API_URL}/guest-bookings`, { params });
      setGuestBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [busNo, date]);

  useEffect(() => {
    fetchGuestBookings();
  }, [fetchGuestBookings]);

  return { guestBookings, loading, error, fetchGuestBookings };
};

export default useAdminGuestBookings;
