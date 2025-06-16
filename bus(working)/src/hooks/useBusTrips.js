import { useState, useEffect } from 'react';
import axios from 'axios';

const useBusTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/bus-trips")
      .then(response => {
        setTrips(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching trips:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { trips, loading, error };
};

export default useBusTrips;
