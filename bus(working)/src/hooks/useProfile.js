import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:8000/api';

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile on mount
  useEffect(() => {
    axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Update profile
  const updateProfile = async (data) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/user-details`, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProfile(prev => ({ ...prev, ...data }));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err);
      setLoading(false);
      return { success: false, error: err };
    }
  };

  return { profile, setProfile, loading, error, updateProfile };
}
