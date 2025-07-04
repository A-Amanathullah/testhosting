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
    axios.get(`${API_URL}/cancellations`)
      .then(res => {
        // Filter by user if needed
        const all = Array.isArray(res.data) ? res.data : [];
        
        let filteredCancellations = [];
        
        // Get user's own cancelled bookings
        filteredCancellations = all.filter(c => String(c.user_id) === String(userId));
        
        // If user is an agent, also get cancelled guest bookings they made
        if (userRole === 'agent') {
          const guestCancellations = all.filter(c => 
            c.booking_type === 'guest' && String(c.agent_id) === String(userId)
          );
          filteredCancellations = [...filteredCancellations, ...guestCancellations];
        }
        
        setCancellations(filteredCancellations);
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
