import { useEffect, useState } from "react";
import { getGuestBookings } from "../services/guestBookingService";

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
    
    // Use the guestBookingService instead of direct axios calls
    getGuestBookings(bus_id, date)
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
