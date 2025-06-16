import { useState, useEffect } from 'react';
import { getAllBuses } from '../services/busApi';
import {getAllSchedules} from '../services/Schedule';

const useBusHook = () => {
    const [trips, setTrips] = useState([]);
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refresh = async () => {
    await fetchBuses();
    await fetchSchedules();
  };

  useEffect(() => {
    fetchBuses();
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
      try {
        const data = await getAllSchedules();
        setTrips(data);
        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setError(error);
        setLoading(false);
      }
    };
  
    const fetchBuses = async () => {
      try {
        const data = await getAllBuses();
        setBuses(data);
        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setError(error);
        setLoading(false);
      }
    };

  return { trips, buses, loading, error, refresh };
}; 

export default useBusHook;
