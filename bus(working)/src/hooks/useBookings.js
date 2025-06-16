import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Add userId as an optional 3rd parameter
const useBookings = (bus_id, date, userIdOrRefreshKey) => {
  const [bookings, setBookings] = useState([]);
  const [frozenSeats, setFrozenSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // If all arguments are empty, fetch all bookings
    if (!bus_id && !date && !userIdOrRefreshKey) {
      axios
        .get(`${API_URL}/bookings`)
        .then((res) => {
          const allBookings = res.data || [];
          setBookings(
            allBookings.filter(
              (b) => String(b.status).toLowerCase() !== "freezed"
            )
          );
          setFrozenSeats(
            allBookings.filter((b) => String(b.status).toLowerCase() === "freezed")
          );
        })
        .catch(setError)
        .finally(() => setLoading(false));
      return;
    }
    // If userId is provided and bus_id/date are not, fetch all bookings for user
    if ((!bus_id || !date) && userIdOrRefreshKey) {
      axios
        .get(`${API_URL}/bookings`, { params: { user_id: userIdOrRefreshKey } })
        .then((res) => {
          const allBookings = res.data || [];
          setBookings(
            allBookings.filter(
              (b) => String(b.status).toLowerCase() !== "freezed"
            )
          );
          setFrozenSeats(
            allBookings.filter((b) => String(b.status).toLowerCase() === "freezed")
          );
        })
        .catch(setError)
        .finally(() => setLoading(false));
      return;
    }
    // If bus_id is provided and date is not, fetch all bookings for that bus
    if (bus_id && !date) {
      axios
        .get(`${API_URL}/bookings`, { params: { bus_id } }) // <-- use bus_id
        .then((res) => {
          const allBookings = res.data || [];
          setBookings(
            allBookings.filter(
              (b) => String(b.status).toLowerCase() !== "freezed"
            )
          );
          setFrozenSeats(
            allBookings.filter((b) => String(b.status).toLowerCase() === "freezed")
          );
        })
        .catch(setError)
        .finally(() => setLoading(false));
      return;
    }
    // If neither bus_id/date nor userId, clear
    if (!bus_id || !date) {
      setBookings([]);
      setFrozenSeats([]);
      setLoading(false);
      return;
    }
    // If bus_id and date are provided, fetch bookings for that bus and date
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/bookings`, {
          params: { bus_id, departure_date: date }, // <-- use bus_id
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
    };
    fetchData();
  }, [bus_id, date, userIdOrRefreshKey]);

  return { bookings, frozenSeats, loading, error };
};

export default useBookings;
