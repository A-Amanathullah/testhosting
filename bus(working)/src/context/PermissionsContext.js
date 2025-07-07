import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ role, children }) => {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async (userRole) => {
    if (!userRole) return {};
    
    try {
      const res = await fetch(`http://localhost:8000/api/role-permissions/${userRole}`);
      if (!res.ok) {
        console.log(`No permissions found for role: ${userRole}`);
        return {};
      }
      const data = await res.json();
      if (data && data.status === 'success') {
        return data.data;
      } else {
        return {};
      }
    } catch (err) {
      console.log(`Error fetching permissions for role ${userRole}:`, err);
      return {};
    }
  };

  const loadPermissions = useCallback(async (userRole = role) => {
    setLoading(true);
    const perms = await fetchPermissions(userRole);
    setPermissions(perms);
    setLoading(false);
    return perms;
  }, [role]);

  useEffect(() => {
    if (!role) return;
    loadPermissions(role);
  }, [role, loadPermissions]);

  return (
    <PermissionsContext.Provider value={{ permissions, loading, loadPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);
