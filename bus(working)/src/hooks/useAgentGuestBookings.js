import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const useAgentGuestBookings = (agentId) => {
  const [guestBookings, setGuestBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!agentId) {
      setGuestBookings([]);
      return;
    }

    const fetchAgentGuestBookings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = getToken();
        const response = await axios.get(`${API_URL}/guest-bookings/agent/${agentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log('Agent guest bookings response:', response.data);
        setGuestBookings(response.data || []);
      } catch (err) {
        console.error('Error fetching agent guest bookings:', err);
        setError(err.response?.data?.message || err.message);
        setGuestBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentGuestBookings();
  }, [agentId]);

  const refreshGuestBookings = () => {
    if (agentId) {
      // Re-trigger the effect by updating a dependency
      setLoading(true);
      const fetchAgentGuestBookings = async () => {
        setError(null);
        
        try {
          const token = getToken();
          const response = await axios.get(`${API_URL}/guest-bookings/agent/${agentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          console.log('Refreshed agent guest bookings:', response.data);
          setGuestBookings(response.data || []);
        } catch (err) {
          console.error('Error refreshing agent guest bookings:', err);
          setError(err.response?.data?.message || err.message);
          setGuestBookings([]);
        } finally {
          setLoading(false);
        }
      };

      fetchAgentGuestBookings();
    }
  };

  return { guestBookings, loading, error, refreshGuestBookings };
};

export default useAgentGuestBookings;
