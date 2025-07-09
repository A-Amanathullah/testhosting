import { useEffect, useState, useCallback } from "react";
import { getGuestBookings } from "../../services/guestBookingService";

const useAdminGuestBookings = (busNo, date) => {
  const [guestBookings, setGuestBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGuestBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all guest bookings if busNo and date are not provided
      // Note: getGuestBookings handles the date formatting internally
      const res = await getGuestBookings(busNo, date);
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
