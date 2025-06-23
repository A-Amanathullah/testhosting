import React from 'react';
import { PermissionsProvider } from './context/PermissionsContext';
import { useAuth } from './context/AuthContext'; // assuming you have an AuthContext
import NotAuthorized from './pages/NotAuthorized';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
// ...other imports

function AppWithPermissions() {
  const { user } = useAuth(); // user.role should be 'Admin', 'Agent', etc.

  return (
    <PermissionsProvider role={user?.role}>
      {/* Place your Navbar and Routes here, using ProtectedRoute for protected pages */}
      <Routes>
        {/* Example: Protect Staff List page */}
        <Route path="/admin/staff/list" element={
          <ProtectedRoute module="Staff List" action="view">
            <StaffListPage />
          </ProtectedRoute>
        } />
        {/* ...other routes... */}
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </PermissionsProvider>
  );
}

export default AppWithPermissions;
