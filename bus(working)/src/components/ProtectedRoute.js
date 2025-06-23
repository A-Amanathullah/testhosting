import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../context/PermissionsContext';

const ProtectedRoute = ({ module, action = 'view', children, fallback = null }) => {
  const { permissions, loading } = usePermissions();

  if (loading) return <div>Loading permissions...</div>;
  if (!permissions || !permissions[module] || !permissions[module][action]) {
    return fallback || <Navigate to="/not-authorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
