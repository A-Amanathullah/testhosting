import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getAgentBookings } from '../../services/agentService';
import { toast } from 'react-toastify';

const AgentBookingsPage = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAgentBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAgentBookings(user.id);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch agent bookings');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    if (user?.role === 'agent') {
      fetchAgentBookings();
    }
  }, [user?.role, fetchAgentBookings]);

  if (user?.role !== 'agent') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to agents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Agent Bookings</h1>
        <p className="text-gray-600">Bookings made for passengers</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-lg text-blue-600">Loading bookings...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">No passenger bookings found.</p>
              <p className="text-gray-400 text-sm mt-2">
                Start booking seats for passengers to see them here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Passenger Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bus & Seat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                        {booking.email && (
                          <div className="text-sm text-gray-500">{booking.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Bus {booking.bus_no}</div>
                        <div className="text-sm text-gray-500">Seats: {booking.seat_no}</div>
                        <div className="text-xs text-gray-400">Serial: {booking.serial_no}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.pickup}</div>
                        <div className="text-xs text-gray-500">to</div>
                        <div className="text-sm text-gray-900">{booking.drop}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(booking.departure_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          Rs. {Number(booking.price).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'Processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Payment: {booking.payment_status || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentBookingsPage;
