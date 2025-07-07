import { useState, useEffect } from "react";
import { fetchUsers } from "../services/userService";

export default function useStaff(refreshKey) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    fetchUsers()
      .then(users => {
        if (isMounted) {
          // Filter out users with role 'User' - only show staff members
          const staffUsers = users.filter(user => {
            const userRole = user.role || (user.roleModel && user.roleModel.name) || '';
            return userRole.toLowerCase() !== 'user';
          });
          
          setStaff(staffUsers);
          setLoading(false);
          setError(null);
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
