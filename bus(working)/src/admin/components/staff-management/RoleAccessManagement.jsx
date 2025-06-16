import React, { useState } from 'react';
import { PERMISSIONS, ROLE_DEFAULT_PERMISSIONS } from './permissions';

const roles = Object.keys(ROLE_DEFAULT_PERMISSIONS);

const RoleAccessManagement = () => {
  // State for role-permission mapping (simulate backend data)
  const [rolePermissions, setRolePermissions] = useState(() => {
    // Start with default permissions
    const initial = {};
    roles.forEach(role => {
      initial[role] = [...(ROLE_DEFAULT_PERMISSIONS[role] || [])];
    });
    return initial;
  });

  // Handle checkbox toggle
  const handleToggle = (role, permKey) => {
    setRolePermissions(prev => {
      const perms = prev[role] || [];
      return {
        ...prev,
        [role]: perms.includes(permKey)
          ? perms.filter(k => k !== permKey)
          : [...perms, permKey],
      };
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Role Access Management</h2>
      <div className="space-y-8">
        {roles.map(role => (
          <div key={role} className="border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold mb-2 capitalize">{role.replace('_', ' ')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {PERMISSIONS.map(perm => (
                <label key={perm.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rolePermissions[role]?.includes(perm.key)}
                    onChange={() => handleToggle(role, perm.key)}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* You can add a save button here to persist changes to backend */}
    </div>
  );
};

export default RoleAccessManagement;
