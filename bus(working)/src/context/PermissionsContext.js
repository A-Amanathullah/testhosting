import React, { createContext, useContext, useState, useEffect } from 'react';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ role, children }) => {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!role) return;
    setLoading(true);
    fetch(`http://localhost:8000/api/role-permissions/${role}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success') {
          setPermissions(data.data);
        } else {
          setPermissions({});
        }
        setLoading(false);
      });
  }, [role]);

  return (
    <PermissionsContext.Provider value={{ permissions, loading }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);
