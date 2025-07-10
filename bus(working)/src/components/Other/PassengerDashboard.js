import React, { useState, useEffect } from 'react';
import Button from './Button';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useBookings from "../../hooks/useBookings";
import useCancellations from '../../hooks/useCancellations';
import useAgentGuestBookings from '../../hooks/useAgentGuestBookings';
import BookingQRCode from '../SeatBooking/BookingQRCode';
import { RiQrCodeFill } from 'react-icons/ri';
import LoyaltyCard from '../../admin/components/loyalty-card/LoyaltyCard';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const PassengerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [qrModal, setQrModal] = useState({ open: false, details: null });
  const [loyaltyMember, setLoyaltyMember] = useState(null);
  const [loyaltyCard, setLoyaltyCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const passengerName = user?.name;
  const isAgent = user?.role === 'agent';

  // Fetch loyalty member data for the user
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        
        // Headers for authenticated requests
        const headers = {};
        if (user.token) {
          headers.Authorization = `Bearer ${user.token}`;
        }
        
        // Fetch all loyalty members and find the one matching this user
        const loyaltyResponse = await axios.get(`${API_URL}/loyalty-members`, { headers });
        
        // Handle different response formats from the API
        let memberData = null;
        if (loyaltyResponse.data && loyaltyResponse.data.data) {
          // Paginated response
          memberData = loyaltyResponse.data.data.find(m => Number(m.user_id) === Number(user.id));
        } else if (loyaltyResponse.data && Array.isArray(loyaltyResponse.data)) {
          // Direct array response
          memberData = loyaltyResponse.data.find(m => Number(m.user_id) === Number(user.id));
        }
        
        if (memberData) {
          setLoyaltyMember(memberData);
          
          // If we have a loyalty card ID, fetch the card details
          if (memberData.loyalty_card_id) {
            const cardResponse = await axios.get(`${API_URL}/loyalty-cards/${memberData.loyalty_card_id}`, { headers });
            setLoyaltyCard(cardResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching loyalty data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoyaltyData();
  }, [user]);

  // Fetch bookings for this user
  const { bookings = [] } = useBookings(undefined, undefined, user?.id);
  // Fetch cancellations for this user (including guest cancellations if agent)
  const { cancellations = [] } = useCancellations(user?.id, user?.role);
  // Fetch guest bookings made by this agent (if user is an agent)
  const { guestBookings = [] } = useAgentGuestBookings(isAgent ? user?.id : null);

  // Calculate stats from bookings and cancellations (including agent guest bookings)
  const stats = {
    booked: bookings.filter(b => String(b.status).toLowerCase() === 'confirmed').length + 
            guestBookings.filter(gb => String(gb.status).toLowerCase() === 'confirmed').length,
    pending: bookings.filter(b => String(b.status).toLowerCase() === 'processing').length + 
             guestBookings.filter(gb => String(gb.status).toLowerCase() === 'processing').length,
    cancelled: cancellations.length, // This now includes both regular and guest cancellations
  };

  // Helper: Check if current time is after 2:00 PM
  const isAfter2PM = () => {
    const now = new Date();
    return now.getHours() > 14 || (now.getHours() === 14 && now.getMinutes() > 0);
  };

  // Helper: Check if booking is today
  const isToday = (dateStr) => {
    const today = new Date();
    const d = new Date(dateStr);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  };
  // Helper: Check if booking is in the future
  const isFuture = (dateStr) => {
    const today = new Date();
    const d = new Date(dateStr);
    // Ignore time, just compare date
    return d > today.setHours(23,59,59,999);
  };

  const actionTooltip = "You can't make changes after 2.00pm";

  // Cancel booking handler (supports both regular bookings and guest bookings)
  const handleCancelBooking = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const isGuestBooking = booking.hasOwnProperty('agent_id');
      
      if (isGuestBooking) {
        // Cancel guest booking (moves to cancellations table)
        await axios.post(`${API_URL}/guest-bookings/${booking.id}/cancel`);
      } else {
        // Cancel regular booking
        await axios.post(`${API_URL}/bookings/${booking.id}/cancel`, {
          ...booking,
          status: 'cancelled',
        });
      }
      
      // Refresh the data
      window.location.reload(); // Or refetch bookings if you want a better UX
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    }
  };

  const renderActions = (status, booking) => {
    const disabled = isAfter2PM();
    const journeyDate = booking.booked_date || booking.date;
    const showCancel = isToday(journeyDate) || isFuture(journeyDate);
    switch (String(status).toLowerCase()) {
      case 'confirmed':
        return (
          <div className="flex justify-center w-full gap-2">
            <div className="relative group w-full sm:w-auto">
              <Button
                variant="destructive"
                className="w-full sm:w-auto bg-red-400 hover:bg-red-500"
                disabled={isToday(journeyDate) ? disabled : false}
                onClick={() => handleCancelBooking(booking)}
                style={{ display: showCancel ? undefined : 'none' }}
              >
                Cancel
              </Button>
              {isToday(journeyDate) && disabled && (
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
                date: journeyDate,
              } })}
              style={{ width: 36, height: 36 }}
            >
              <RiQrCodeFill size={20} />
            </button>
          </div>
        );
      case 'cancelled':
        return null;
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
                disabled={isToday(journeyDate) ? disabled : false}
                onClick={() => handleCancelBooking(booking)}
                style={{ display: showCancel ? undefined : 'none' }}
              >
                Cancel
              </Button>
              {isToday(journeyDate) && disabled && (
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

  const renderGuestBookingActions = (status, guestBooking) => {
    const disabled = isAfter2PM();
    const journeyDate = guestBooking.departure_date;
    const showCancel = isToday(journeyDate) || isFuture(journeyDate);
    
    switch (String(status).toLowerCase()) {
      case 'confirmed':
        return (
          <div className="flex justify-center w-full gap-2">
            <div className="relative group w-full sm:w-auto">
              <Button
                variant="destructive"
                className="w-full sm:w-auto bg-red-400 hover:bg-red-500"
                disabled={isToday(journeyDate) ? disabled : false}
                onClick={() => handleCancelBooking(guestBooking)}
                style={{ display: showCancel ? undefined : 'none' }}
              >
                Cancel
              </Button>
              {isToday(journeyDate) && disabled && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  {actionTooltip}
                </span>
              )}
            </div>
            <button
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
              title="See QR & Download"
              onClick={() => setQrModal({ open: true, details: {
                busName: guestBooking.bus_no,
                seatNumbers: String(guestBooking.seat_no).split(',').map(s => s.trim()),
                pickup: guestBooking.pickup,
                drop: guestBooking.drop,
                price: guestBooking.price,
                date: journeyDate,
                guestName: guestBooking.name,
                guestPhone: guestBooking.phone,
              } })}
              style={{ width: 36, height: 36 }}
            >
              <RiQrCodeFill size={20} />
            </button>
          </div>
        );
      case 'cancelled':
        return null;
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
                disabled={isToday(journeyDate) ? disabled : false}
                onClick={() => handleCancelBooking(guestBooking)}
                style={{ display: showCancel ? undefined : 'none' }}
              >
                Cancel
              </Button>
              {isToday(journeyDate) && disabled && (
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
      {/* Loyalty Card Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Loyalty Card Display - More Prominent Position */}
          <div className="w-full md:w-1/2 max-w-md order-2 md:order-1">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-64 w-full rounded-lg"></div>
            ) : loyaltyMember && loyaltyCard ? (
              <LoyaltyCard 
                tier={loyaltyMember.card_type || loyaltyCard.tier}
                points={loyaltyMember.total_points}
                customers={passengerName}
                color={loyaltyCard.color || '#1976D2'}
                cardNo={loyaltyMember.card_number || '0000 0000 0000 0000'}
                canEdit={false}
              />
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Join Our Loyalty Program!</h3>
                <p className="text-gray-600">Get exclusive benefits and earn points with every trip</p>
              </div>
            )}
          </div>
          
          {/* Loyalty Member Details */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
            ) : loyaltyMember ? (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="font-bold text-xl mb-4 text-blue-800">Your Loyalty Profile</h3>
                <div className="space-y-3">
                  <p className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Member Name:</span> 
                    <span className="font-semibold">{passengerName}</span>
                  </p>
                  <p className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Member Since:</span> 
                    <span>{new Date(loyaltyMember.member_since).toLocaleDateString()}</span>
                  </p>
                  <p className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Total Points:</span> 
                    <span className="font-bold text-blue-700">{loyaltyMember.total_points}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-600">Status:</span> 
                    <span className={`font-medium px-3 py-1 rounded-full ${loyaltyMember.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {loyaltyMember.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-center">No loyalty membership found</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Your Personal Bookings</h3>
        <table className="w-full min-w-[700px] table-auto border border-gray-200 text-xs sm:text-sm md:text-base">
          <thead className="bg-gray-100 text-xs sm:text-base md:text-lg">
            <tr>
              {/* <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Booked Date</th> */}
              <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Bus No</th>
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
                {/* <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{booking.booked_date}</td> */}
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{booking.bus_no}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{booking.pickup}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{booking.drop}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{booking.booked_date}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{Array.isArray(booking.seat_no) ? booking.seat_no.join(', ') : booking.seat_no}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border capitalize break-words">{booking.status}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border space-x-1">{renderActions(booking.status, booking)}</td>
              </tr>
            ))}
            {/* Show cancellations as read-only rows */}
            {cancellations.map((c) => (
              <tr key={`cancelled-${c.id}`} className="text-center bg-red-50">
                {/* <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{c.booked_date}</td> */}
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{c.bus_no}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{c.pickup}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{c.drop}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{c.booked_date}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{Array.isArray(c.seat_no) ? c.seat_no.join(', ') : c.seat_no}</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border capitalize break-words">cancelled</td>
                <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border text-gray-400 italic">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Agent Guest Bookings Section */}
      {isAgent && (
        <div className="w-full overflow-x-auto mt-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Guest Bookings You Made</h3>
          <table className="w-full min-w-[800px] table-auto border border-gray-200 text-xs sm:text-sm md:text-base">
            <thead className="bg-blue-100 text-xs sm:text-base md:text-lg">
              <tr>
                <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Guest Name</th>
                <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Phone</th>
                <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Bus No</th>
                <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Pickup</th>
                <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Drop</th>
                <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Journey Date</th>
                <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Seats</th>
                <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Status</th>
                <th className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {guestBookings.map((guestBooking) => (
                <tr key={`guest-${guestBooking.id}`} className="text-center bg-blue-50">
                  <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{guestBooking.name}</td>
                  <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{guestBooking.phone}</td>
                  <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{guestBooking.bus_no}</td>
                  <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{guestBooking.pickup}</td>
                  <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{guestBooking.drop}</td>
                  <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{guestBooking.departure_date}</td>
                  <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border break-words">{guestBooking.seat_no}</td>
                  <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border capitalize break-words">{guestBooking.status}</td>
                  <td className="px-1 sm:px-2 md:px-4 py-1 sm:py-2 border space-x-1">
                    {renderGuestBookingActions(guestBooking.status, guestBooking)}
                  </td>
                </tr>
              ))}
              {guestBookings.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500 italic">
                    No guest bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {qrModal.open && (
        <BookingQRCode bookingDetails={qrModal.details} onCancel={() => setQrModal({ open: false, details: null })} />
      )}
    </div>
  );
};

export default PassengerDashboard;
