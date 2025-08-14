import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const useCancellations = (userId, userRole) => {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    // For agents, fetch both user_id and agent_id cancellations
    let url = `${API_URL}/cancellations?user_id=${userId}`;
    if (userRole && userRole.toLowerCase() === 'agent') {
      url += `&agent_id=${userId}`;
    }
    axios.get(url)
      .then(res => {
        // Backend now returns all relevant cancellations
        setCancellations(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [userId, userRole]);

  return { cancellations, loading, error };
};

export default useCancellations;
