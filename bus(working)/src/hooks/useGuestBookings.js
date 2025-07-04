import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const useGuestBookings = (bus_id, date, refreshTrigger = 0) => {
  const [guestBookings, setGuestBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bus_id || !date) {
      console.log("useGuestBookings: Missing bus_id or date, clearing bookings");
      setGuestBookings([]);
      return;
    }
    console.log(`useGuestBookings: Fetching for bus_id=${bus_id}, date=${date}, refreshTrigger=${refreshTrigger}`);
    setLoading(true);
    setError(null);
    axios
      .get(`${API_URL}/guest-bookings`, { params: { bus_id, departure_date: date } })
      .then((res) => {
        console.log("useGuestBookings: Raw response:", res.data);
        const bookings = Array.isArray(res.data) ? res.data : [];
        console.log("useGuestBookings: Processed bookings:", bookings);
        setGuestBookings(bookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("useGuestBookings: Error fetching guest bookings:", err);
        setError(err);
        setLoading(false);
      });
  }, [bus_id, date, refreshTrigger]); // Add refreshTrigger as dependency

  return { guestBookings, loading, error };
};

export default useGuestBookings;
