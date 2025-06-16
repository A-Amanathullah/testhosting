import React from "react";
import RoleAccessManagement from "../../components/staff-management/RoleAccessManagement";

const RoleAccessPage = () => {
  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Role Access Management</h1>
        <RoleAccessManagement />
      </div>
    </div>
  );
};

export default RoleAccessPage;
