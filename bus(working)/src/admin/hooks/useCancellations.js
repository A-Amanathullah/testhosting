import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Fetch all cancellations, filtering is done in the component
const useCancellations = () => {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define fetchCancellations as a reusable function
  const fetchCancellations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/cancellations`);
      setCancellations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCancellations();
  }, [fetchCancellations]);

  return { cancellations, loading, error, fetchCancellations };
};

export default useCancellations;
