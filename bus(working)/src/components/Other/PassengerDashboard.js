import React, { useState } from 'react';
import Button from './Button';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useBookings from "../../hooks/useBookings";
import BookingQRCode from '../SeatBooking/BookingQRCode';
import { RiQrCodeFill } from 'react-icons/ri';


const PassengerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [qrModal, setQrModal] = useState({ open: false, details: null });

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

  const renderActions = (status, booking) => {
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
            <button
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
              title="See QR & Download"
              onClick={() => setQrModal({ open: true, details: {
                busName: booking.bus_no || booking.busName,
                seatNumbers: Array.isArray(booking.seat_no) ? booking.seat_no : String(booking.seat_no).split(',').map(s => s.trim()),
                pickup: booking.pickup,
                drop: booking.drop,
                price: booking.price,
                date: booking.booked_date || booking.date,
              } })}
              style={{ width: 36, height: 36 }}
            >
              <RiQrCodeFill size={20} />
            </button>
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
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 flex-col h-full w-full max-w-full overflow-x-auto">
      <h2 className="text-2xl sm:text-4xl md:text-6xl p-2 sm:p-5 text-center font-bold break-words">Welcome Back, {passengerName}</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 pb-4 sm:pb-10 w-full">
        <div className="bg-blue-200 p-3 sm:p-6 rounded-xl shadow w-full">
          <h3 className="text-base sm:text-xl font-medium">Total Booked</h3>
          <p className="text-xl sm:text-3xl font-bold text-blue-800">{stats.booked}</p>
        </div>
        <div className="bg-yellow-100 p-2 sm:p-4 rounded-xl shadow w-full">
          <h3 className="text-base sm:text-xl font-medium">Pending</h3>
          <p className="text-xl sm:text-3xl font-bold text-yellow-800">{stats.pending}</p>
        </div>
        <div className="bg-red-100 p-2 sm:p-4 rounded-xl shadow w-full">
          <h3 className="text-base sm:text-xl font-medium">Cancelled</h3>
          <p className="text-xl sm:text-3xl font-bold text-red-800">{stats.cancelled}</p>
        </div>
      </div>

      {/* Booking Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] table-auto border border-gray-200 text-xs sm:text-sm md:text-base">
          <thead className="bg-gray-100 text-xs sm:text-base md:text-lg">
            <tr>
              <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">ID</th>
              <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Pickup</th>
              <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Drop</th>
              <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Journey Date</th>
              <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Seats</th>
              <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Status</th>
              <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="text-center">
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{booking.id}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{booking.pickup}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{booking.drop}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{booking.booked_date}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{Array.isArray(booking.seat_no) ? booking.seat_no.join(', ') : booking.seat_no}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border capitalize break-words">{booking.status}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border space-x-1">{renderActions(booking.status, booking)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {qrModal.open && (
        <BookingQRCode bookingDetails={qrModal.details} onCancel={() => setQrModal({ open: false, details: null })} />
      )}
    </div>
  );
};

export default PassengerDashboard;
