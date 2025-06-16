import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useStaff from "../hooks/useStaff";

const STAFF_ACTIONS = [
  {
    permission: "view_schedules",
    label: "View Schedules",
    onClick: (navigate) => navigate("/admin/bus-schedule"),
  },
  {
    permission: "book_seats",
    label: "Book Seats",
    onClick: (navigate) => navigate("/busList"),
  },
  {
    permission: "view_reports",
    label: "View Reports",
    onClick: (navigate) => navigate("/admin/report/booking"),
  },
  // Add more actions as needed
];

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { staff } = useStaff();

  // Find the staff record for the logged-in user
  const staffRecord = staff.find((s) => s.email === user?.email);
  const permissions = staffRecord?.permissions || [];

  console.log("Staff permissions:", permissions);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Staff Dashboard</h1>
        <div className="space-y-4">
          {STAFF_ACTIONS.filter((action) => permissions.includes(action.permission)).length === 0 && (
            <div className="text-center text-gray-500">You do not have access to any actions.</div>
          )}
          {STAFF_ACTIONS.filter((action) => permissions.includes(action.permission)).map((action) => (
            <button
              key={action.permission}
              onClick={() => action.onClick(navigate)}
              className="w-full py-3 px-4 bg-red-700 text-white font-semibold rounded-lg shadow-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
