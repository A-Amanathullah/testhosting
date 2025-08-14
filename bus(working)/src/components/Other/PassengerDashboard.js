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
  // Helper: Format date string to YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toISOString().slice(0, 10);
  };
  // Tab state for bookings section
  const [activeBookingTab, setActiveBookingTab] = useState('personal'); // 'personal' or 'guest'
  const { user } = useContext(AuthContext);
  const [qrModal, setQrModal] = useState({ open: false, details: null });
  const [loyaltyMember, setLoyaltyMember] = useState(null);
  const [loyaltyCard, setLoyaltyCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const passengerName = user?.name;
  const isAgent = user?.role?.toLowerCase() === 'agent';

  // ...existing code...

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

  // ...existing code...

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

  // Sort bookings, cancellations, and guestBookings by created_at descending (newest first)
  const sortedBookings = [...bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const sortedCancellations = [...cancellations].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const sortedGuestBookings = [...guestBookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Filter cancellations for each tab (define here for pagination and rendering)
  const personalCancellations = sortedCancellations.filter(c => !c.booking_type || c.booking_type !== 'guest');
  const guestCancellations = sortedCancellations.filter(c => c.booking_type === 'guest');

  // Pagination state and helpers
  const PAGE_SIZE = 10;
  // Bookings
  const [bookingPage, setBookingPage] = useState(1);
  const totalBookingPages = Math.ceil(sortedBookings.length / PAGE_SIZE);
  const pagedBookings = sortedBookings.slice((bookingPage - 1) * PAGE_SIZE, bookingPage * PAGE_SIZE);
  // Guest Bookings
  const [guestBookingPage, setGuestBookingPage] = useState(1);
  const totalGuestBookingPages = Math.ceil(sortedGuestBookings.length / PAGE_SIZE);
  const pagedGuestBookings = sortedGuestBookings.slice((guestBookingPage - 1) * PAGE_SIZE, guestBookingPage * PAGE_SIZE);
  // Cancellations (personal)
  const [personalCancellationPage, setPersonalCancellationPage] = useState(1);
  const totalPersonalCancellationPages = Math.ceil(personalCancellations.length / PAGE_SIZE);
  const pagedPersonalCancellations = personalCancellations.slice((personalCancellationPage - 1) * PAGE_SIZE, personalCancellationPage * PAGE_SIZE);
  // Cancellations (guest)
  const [guestCancellationPage, setGuestCancellationPage] = useState(1);
  const totalGuestCancellationPages = Math.ceil(guestCancellations.length / PAGE_SIZE);
  const pagedGuestCancellations = guestCancellations.slice((guestCancellationPage - 1) * PAGE_SIZE, guestCancellationPage * PAGE_SIZE);

  // Pagination component (modern look)
  const Pagination = ({ page, setPage, totalPages }) => (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 font-medium hover:bg-gray-200 disabled:opacity-50 transition"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 rounded-lg border font-semibold transition ${page === i + 1 ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 font-medium hover:bg-gray-200 disabled:opacity-50 transition"
      >
        Next
      </button>
    </div>
  );

  // Tab state for cancellations section (for agents)
  const [activeCancellationTab, setActiveCancellationTab] = useState('personal'); // 'personal' or 'guest'


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 py-6 px-2 sm:px-4 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-4 sm:p-8 md:p-12 space-y-8 border border-blue-100 mt-4 mb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow">Passenger Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
            <span className="text-base sm:text-lg text-gray-500 font-medium">Welcome, <span className="text-blue-700 font-bold">{passengerName}</span></span>
          </div>
        </div>

        {/* Loyalty Card Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-8">
          {/* Loyalty Card Display */}
          <div className="w-full md:w-1/2 max-w-md order-2 md:order-1">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-64 w-full rounded-2xl shadow"></div>
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
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200 rounded-2xl p-8 text-center shadow">
                <h3 className="text-xl font-bold mb-2 text-blue-800">Join Our Loyalty Program!</h3>
                <p className="text-gray-600">Get exclusive benefits and earn points with every trip</p>
              </div>
            )}
          </div>
          {/* Loyalty Member Details */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-32 rounded-2xl shadow"></div>
            ) : loyaltyMember ? (
              <div className="p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
                <h3 className="font-bold text-2xl mb-4 text-blue-800">Your Loyalty Profile</h3>
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
              <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 shadow">
                <p className="text-gray-500 text-center">No loyalty membership found</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 sm:pb-10 w-full">
          <div className="bg-gradient-to-br from-blue-200 to-blue-300 p-6 rounded-2xl shadow text-center border border-blue-100">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">Total Booked</h3>
            <p className="text-3xl font-extrabold text-blue-800">{stats.booked}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-2xl shadow text-center border border-yellow-100">
            <h3 className="text-lg font-semibold mb-2 text-yellow-900">Pending</h3>
            <p className="text-3xl font-extrabold text-yellow-800">{stats.pending}</p>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-2xl shadow text-center border border-red-100">
            <h3 className="text-lg font-semibold mb-2 text-red-900">Cancelled</h3>
            <p className="text-3xl font-extrabold text-red-800">{stats.cancelled}</p>
          </div>
        </div>

        {/* Bookings Tab Menu and Table Section */}
        <div className="w-full overflow-x-auto">
          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-2 rounded-t-xl font-semibold border-b-4 transition-colors duration-200 shadow-sm ${activeBookingTab === 'personal' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setActiveBookingTab('personal')}
            >
              Your Personal Bookings
            </button>
            {isAgent && (
              <button
                className={`px-4 py-2 rounded-t-xl font-semibold border-b-4 transition-colors duration-200 shadow-sm ${activeBookingTab === 'guest' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setActiveBookingTab('guest')}
              >
                Guest Bookings You Made
              </button>
            )}
          </div>

        {/* Personal Bookings Table with Pagination and modern card */}
        {activeBookingTab === 'personal' && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-gray-100">
            <table className="w-full min-w-[700px] table-auto text-xs sm:text-sm md:text-base rounded-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 text-xs sm:text-base md:text-lg">
                <tr>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Booked/Cancelled Date</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Bus No</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Pickup</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Drop</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Journey Date</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Seats</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedBookings.map((booking, idx) => (
                  <tr key={booking.id} className={`text-center transition hover:bg-blue-50 ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                    <td className="px-3 py-2 break-words">{formatDate(booking.created_at)}</td>
                    <td className="px-3 py-2 break-words">{booking.bus_no}</td>
                    <td className="px-3 py-2 break-words">{booking.pickup}</td>
                    <td className="px-3 py-2 break-words">{booking.drop}</td>
                    <td className="px-3 py-2 break-words">{booking.booked_date}</td>
                    <td className="px-3 py-2 break-words">{Array.isArray(booking.seat_no) ? booking.seat_no.join(', ') : booking.seat_no}</td>
                    <td className="px-3 py-2 capitalize break-words font-semibold">{booking.status}</td>
                    <td className="px-3 py-2 space-x-1">{renderActions(booking.status, booking)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalBookingPages > 1 && (
              <Pagination page={bookingPage} setPage={setBookingPage} totalPages={totalBookingPages} />
            )}
          </div>
        )}

        {/* Guest Bookings Table with Pagination and modern card */}
        {isAgent && activeBookingTab === 'guest' && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-gray-100">
            <table className="w-full min-w-[800px] table-auto text-xs sm:text-sm md:text-base rounded-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 text-xs sm:text-base md:text-lg">
                <tr>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Booked Date</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Guest Name</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Phone</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Bus No</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Pickup</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Drop</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Journey Date</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Seats</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedGuestBookings.map((guestBooking, idx) => (
                  <tr key={`guest-${guestBooking.id}`} className={`text-center transition hover:bg-blue-50 ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                    <td className="px-3 py-2 break-words">{formatDate(guestBooking.created_at)}</td>
                    <td className="px-3 py-2 break-words">{guestBooking.name}</td>
                    <td className="px-3 py-2 break-words">{guestBooking.phone}</td>
                    <td className="px-3 py-2 break-words">{guestBooking.bus_no}</td>
                    <td className="px-3 py-2 break-words">{guestBooking.pickup}</td>
                    <td className="px-3 py-2 break-words">{guestBooking.drop}</td>
                    <td className="px-3 py-2 break-words">{guestBooking.departure_date}</td>
                    <td className="px-3 py-2 break-words">{guestBooking.seat_no}</td>
                    <td className="px-3 py-2 capitalize break-words font-semibold">{guestBooking.status}</td>
                    <td className="px-3 py-2 space-x-1">{renderGuestBookingActions(guestBooking.status, guestBooking)}</td>
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
            {totalGuestBookingPages > 1 && (
              <Pagination page={guestBookingPage} setPage={setGuestBookingPage} totalPages={totalGuestBookingPages} />
            )}
          </div>
        )}

        {/* Cancellations Tab Menu and Table Section (for agents) with Pagination and modern card */}
        {isAgent && (
          <div className="mt-8">
            <div className="flex gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded-t-md font-semibold border-b-2 transition-colors duration-200 ${activeCancellationTab === 'personal' ? 'border-red-600 text-red-700 bg-red-50' : 'border-transparent text-gray-500 bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setActiveCancellationTab('personal')}
              >
                Your Cancelled Bookings
              </button>
              <button
                className={`px-4 py-2 rounded-t-md font-semibold border-b-2 transition-colors duration-200 ${activeCancellationTab === 'guest' ? 'border-red-600 text-red-700 bg-red-50' : 'border-transparent text-gray-500 bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setActiveCancellationTab('guest')}
              >
                Guest Cancellations You Made
              </button>
            </div>
            {/* Personal Cancellations Table with Pagination and card */}
            {activeCancellationTab === 'personal' && (
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-gray-100">
                <table className="w-full min-w-[700px] table-auto text-xs sm:text-sm md:text-base rounded-xl overflow-hidden">
                  <thead className="bg-gradient-to-r from-red-100 to-red-200 text-red-900 text-xs sm:text-base md:text-lg">
                    <tr>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Cancelled Date</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Bus No</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Pickup</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Drop</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Journey Date</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Seats</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedPersonalCancellations.map((c, idx) => (
                      <tr key={`cancelled-personal-${c.id}`} className={`text-center transition hover:bg-red-50 ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                        <td className="px-3 py-2 break-words">{formatDate(c.created_at)}</td>
                        <td className="px-3 py-2 break-words">{c.bus_no}</td>
                        <td className="px-3 py-2 break-words">{c.pickup}</td>
                        <td className="px-3 py-2 break-words">{c.drop}</td>
                        <td className="px-3 py-2 break-words">{c.booked_date}</td>
                        <td className="px-3 py-2 break-words">{Array.isArray(c.seat_no) ? c.seat_no.join(', ') : c.seat_no}</td>
                        <td className="px-3 py-2 capitalize break-words font-semibold">cancelled</td>
                      </tr>
                    ))}
                    {pagedPersonalCancellations.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-gray-500 italic">
                          No personal cancellations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {totalPersonalCancellationPages > 1 && (
                  <Pagination page={personalCancellationPage} setPage={setPersonalCancellationPage} totalPages={totalPersonalCancellationPages} />
                )}
              </div>
            )}
            {/* Guest Cancellations Table with Pagination and card */}
            {activeCancellationTab === 'guest' && (
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-gray-100">
                <table className="w-full min-w-[700px] table-auto text-xs sm:text-sm md:text-base rounded-xl overflow-hidden">
                  <thead className="bg-gradient-to-r from-red-200 to-red-300 text-red-900 text-xs sm:text-base md:text-lg">
                    <tr>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Cancelled Date</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Guest Name</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Phone</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Bus No</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Pickup</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Drop</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Journey Date</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Seats</th>
                      <th className="px-3 py-2 font-semibold whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedGuestCancellations.map((c, idx) => (
                      <tr key={`cancelled-guest-${c.id}`} className={`text-center transition hover:bg-red-50 ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                        <td className="px-3 py-2 break-words">{formatDate(c.created_at)}</td>
                        <td className="px-3 py-2 break-words">{c.name}</td>
                        <td className="px-3 py-2 break-words">{c.phone}</td>
                        <td className="px-3 py-2 break-words">{c.bus_no}</td>
                        <td className="px-3 py-2 break-words">{c.pickup}</td>
                        <td className="px-3 py-2 break-words">{c.drop}</td>
                        <td className="px-3 py-2 break-words">{c.booked_date}</td>
                        <td className="px-3 py-2 break-words">{Array.isArray(c.seat_no) ? c.seat_no.join(', ') : c.seat_no}</td>
                        <td className="px-3 py-2 capitalize break-words font-semibold">cancelled</td>
                      </tr>
                    ))}
                    {pagedGuestCancellations.length === 0 && (
                      <tr>
                        <td colSpan="9" className="px-4 py-8 text-center text-gray-500 italic">
                          No guest cancellations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {totalGuestCancellationPages > 1 && (
                  <Pagination page={guestCancellationPage} setPage={setGuestCancellationPage} totalPages={totalGuestCancellationPages} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {qrModal.open && (
        <BookingQRCode bookingDetails={qrModal.details} onCancel={() => setQrModal({ open: false, details: null })} />
      )}

    </div> {/* End of main card container */}
    {qrModal.open && (
      <BookingQRCode bookingDetails={qrModal.details} onCancel={() => setQrModal({ open: false, details: null })} />
    )}
  </div> // End of gradient background wrapper
);
};

export default PassengerDashboard;
