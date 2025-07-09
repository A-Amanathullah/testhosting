import { useEffect, useState, useCallback } from "react";
import { getGuestBookings } from "../../services/guestBookingService";
import { normalizeToYYYYMMDD } from "../../utils/dateUtils";

const useAdminGuestBookings = (busNo, date) => {
  const [guestBookings, setGuestBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGuestBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Always fetch guest bookings - let the service and backend handle filtering
      const res = await getGuestBookings(busNo, date);
      
      // Process the data to ensure we have consistent formatting
      const processedData = Array.isArray(res.data) ? res.data.map(booking => ({
        ...booking,
        // Normalize the departure date to ensure consistency
        normalizedDate: normalizeToYYYYMMDD(booking.departure_date)
      })) : [];
      
      setGuestBookings(processedData);
    } catch (err) {
      console.error("Error fetching guest bookings:", err);
      setError(err);
      setGuestBookings([]); // Set empty array on error
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
