import React from 'react';
import  Button  from './Button' // one level up from SeatBooking
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useBookings from "../../hooks/useBookings";


const PassengerDashboard = () => {
  const { user } = useContext(AuthContext);

  const passengerName = user.name;

  // Fetch bookings for this user
  const { bookings = [] } = useBookings(undefined, undefined, user?.id);

  // Calculate stats from bookings
  const stats = {
    booked: bookings.filter(b => String(b.status).toLowerCase() === 'confirmed').length,
    pending: bookings.filter(b => String(b.status).toLowerCase() === 'processing').length,
    cancelled: bookings.filter(b => String(b.status).toLowerCase() === 'cancelled').length,
  };

  // Helper: Check if current time is after 2:00 PM
  const isAfter2PM = () => {
    const now = new Date();
    return now.getHours() > 14 || (now.getHours() === 14 && now.getMinutes() > 0);
  };

  const actionTooltip = "You can't make changes after 2.00pm";

  const renderActions = (status) => {
    const disabled = isAfter2PM();
    switch (String(status).toLowerCase()) {
      case 'confirmed':
        return (
          <div className="flex justify-center w-full gap-2">
            <div className="relative group w-full sm:w-auto">
              <Button
                variant="destructive"
                className="w-full sm:w-auto bg-red-400 hover:bg-red-500"
                disabled={disabled}
              >
                Cancel
              </Button>
              {disabled && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  {actionTooltip}
                </span>
              )}
            </div>
            {/* <Button variant="secondary">Change</Button> */}
          </div>
        );
      case 'cancelled':
        return null; // Or add a rebook button if needed
      case 'processing':
        return (
          <div className="flex justify-center w-full gap-2">
            <div className="relative group w-full sm:w-auto">
              <Button
                variant="default"
                className="bg-green-400 text-black hover:bg-green-500 w-full sm:w-auto"
                disabled={disabled}
              >
                Complete
              </Button>
              {disabled && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  {actionTooltip}
                </span>
              )}
            </div>
            <div className="relative group w-full sm:w-auto">
              <Button
                variant="destructive"
                className="bg-red-400 hover:bg-red-500 w-full sm:w-auto"
                disabled={disabled}
              >
                Cancel
              </Button>
              {disabled && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  {actionTooltip}
                </span>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 flex-col h-full ">
      <h2 className="text-3xl sm:text-5xl md:text-7xl p-2 sm:p-5 text-center font-bold">Welcome Back, {passengerName}</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 pb-4 sm:pb-10">
        <div className="bg-blue-200 p-3 sm:p-6 rounded-xl shadow">
          <h3 className="text-lg sm:text-2xl font-medium">Total Booked</h3>
          <p className="text-2xl sm:text-4xl font-bold text-blue-800">{stats.booked}</p>
        </div>
        <div className="bg-yellow-100 p-2 sm:p-4 rounded-xl shadow">
          <h3 className="text-lg sm:text-2xl font-medium">Pending</h3>
          <p className="text-2xl sm:text-4xl font-bold text-yellow-800">{stats.pending}</p>
        </div>
        <div className="bg-red-100 p-2 sm:p-4 rounded-xl shadow">
          <h3 className="text-lg sm:text-2xl font-medium">Cancelled</h3>
          <p className="text-2xl sm:text-4xl font-bold text-red-800">{stats.cancelled}</p>
        </div>
      </div>

      {/* Booking Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 text-xs sm:text-sm md:text-base">
          <thead className="bg-gray-100 text-base sm:text-xl">
            <tr>
              <th className="px-2 sm:px-4 py-2 border">ID</th>
              <th className="px-2 sm:px-4 py-2 border">Pickup</th>
              <th className="px-2 sm:px-4 py-2 border">Drop</th>
              <th className="px-2 sm:px-4 py-2 border">Journey Date</th>
              <th className="px-2 sm:px-4 py-2 border">Seats</th>
              <th className="px-2 sm:px-4 py-2 border">Status</th>
              <th className="px-2 sm:px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="text-center">
                <td className="px-2 sm:px-4 py-2 border">{booking.id}</td>
                <td className="px-2 sm:px-4 py-2 border">{booking.pickup}</td>
                <td className="px-2 sm:px-4 py-2 border">{booking.drop}</td>
                <td className="px-2 sm:px-4 py-2 border">{booking.booked_date}</td>
                <td className="px-2 sm:px-4 py-2 border">{booking.seat_no.join(', ')}</td>
                <td className="px-2 sm:px-4 py-2 border capitalize">{booking.status}</td>
                <td className="px-2 sm:px-4 py-2 border space-x-1">{renderActions(booking.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PassengerDashboard;
