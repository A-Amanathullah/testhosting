import React from 'react';
import { PERMISSIONS } from './permissions';

const PermissionCheckboxList = ({ value = [], onChange, disabled = false }) => {
  const handleToggle = (permKey) => {
    if (value.includes(permKey)) {
      onChange(value.filter((k) => k !== permKey));
    } else {
      onChange([...value, permKey]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {PERMISSIONS.map((perm) => (
        <label key={perm.key} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.includes(perm.key)}
            onChange={() => handleToggle(perm.key)}
            disabled={disabled}
            className="h-4 w-4 text-red-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">{perm.label}</span>
        </label>
      ))}
    </div>
  );
};

export default PermissionCheckboxList;
