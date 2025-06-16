import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export default function useStaff(refreshKey) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios.get(`${API_URL}/staffs`)
      .then(res => {
        if (isMounted) {
          setStaff(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [refreshKey]);

  return { staff, loading, error };
}
