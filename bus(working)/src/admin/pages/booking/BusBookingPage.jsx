import React, { useState, useEffect, useRef } from 'react';
import { usePermissions } from '../../../context/PermissionsContext';
import {
  BusSelector,
  DateCalendarSelector,
  PrintButton,
  BusSeatLayout,
  SeatLegend,
  BookingTable
} from '../../components/bus-booking';
import '../../components/bus-booking/print.css';
import useBusHook from '../../../hooks/useBusHook';
import useBookings from '../../../hooks/useBookings';
import useAdminCancellations from '../../../admin/hooks/useCancellations';
import useAdminGuestBookings from '../../../admin/hooks/useGuestBookings';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const BusBookingPage = () => {
  // State for selected filters and data
  const [selectedBusNo, setSelectedBusNo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [seatStatus, setSeatStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [refreshData, setRefreshData] = useState(0); // Used to trigger refetching data

  const { buses, trips: schedules, loading: busHookLoading, error: busHookError } = useBusHook();
  const { bookings, frozenSeats, loading: bookingsLoading, error: bookingsError, fetchBookings } = useBookings(undefined, undefined);
  const { cancellations, loading: cancellationsLoading, fetchCancellations } = useAdminCancellations(selectedBusNo, selectedDate);
  const { guestBookings, loading: guestBookingsLoading, fetchGuestBookings } = useAdminGuestBookings(selectedBusNo, selectedDate);
  const { permissions } = usePermissions();

  // Reference to the table for printing
  const printTableRef = useRef(null);

  // Print handler for React 19 (no react-to-print)
  const handlePrint = () => {
    if (!printTableRef.current) return;
    const printContents = printTableRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=800,width=1200');
    if (!printWindow) {
      setNotification('Popup blocked! Please allow popups for this site to print.');
      return;
    }
    printWindow.document.write('<html><head><title>Bus Booking Report</title>');
    // Inline minimal print styles for clarity
    printWindow.document.write('<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ccc;padding:8px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Refresh data when refreshData state changes
  useEffect(() => {
    if (refreshData > 0) {
      fetchBookings();
      fetchCancellations();
      fetchGuestBookings();
    }
  }, [refreshData, fetchBookings, fetchCancellations, fetchGuestBookings]);

  // Handle cancel booking (supports both regular and guest bookings)
  const handleCancelBooking = async (booking) => {
    if (!hasPermission('edit')) {
      setNotification("You don't have permission to cancel bookings.");
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      setIsLoading(true);
      const isGuestBooking = booking.type === 'guest';
      
      if (isGuestBooking) {
        // Cancel guest booking (moves to cancellations table)
        await axios.post(`${API_URL}/guest-bookings/${booking.raw.id}/cancel`);
      } else {
        // Cancel regular booking
        await axios.post(`${API_URL}/bookings/${booking.raw.id}/cancel`, {
          ...booking.raw,
          status: 'cancelled',
        });
      }
      
      // Show success notification
      setNotification(`${isGuestBooking ? 'Guest booking' : 'Booking'} successfully cancelled.`);
      
      // Refresh data
      setRefreshData(prev => prev + 1);
    } catch (err) {
      setNotification('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bookings and frozen seats when bus and date are selected
  useEffect(() => {
    const scheduleInfo = schedules.find(
      (schedule) => schedule.bus_no === selectedBusNo && schedule.departure_date === selectedDate
    );
    const busInfo = buses.find((bus) => bus.bus_no === selectedBusNo);

    if (selectedBusNo && selectedDate && scheduleInfo) {
      setIsLoading(true);
      // Generate seat status map
      const seatStatusMap = {};
      for (let i = 1; i <= (busInfo?.total_seats || 0); i++) {
        seatStatusMap[i] = 'available';
      }
      // Filter bookings and frozenSeats for selected bus and date
      const filteredBookings = (bookings || []).filter(
        (b) =>
          String(b.bus_no) === String(selectedBusNo) &&
          String(b.departure_date || b.departureDate) === String(selectedDate)
      );
      const filteredFrozenSeats = (frozenSeats || []).filter(
        (f) =>
          String(f.bus_no) === String(selectedBusNo) &&
          String(f.departure_date || f.departureDate) === String(selectedDate)
      );
      // Filter cancellations for selected bus and date
      const filteredCancellations = (cancellations || []).filter(
        (c) =>
          String(c.bus_no) === String(selectedBusNo) &&
          String(c.departure_date) === String(selectedDate)
      );
      
      // Filter guest bookings for selected bus and date
      const filteredGuestBookings = (guestBookings || []).filter(
        (g) =>
          String(g.bus_no) === String(selectedBusNo) &&
          String(g.departure_date) === String(selectedDate)
      );
      
      // Collect all cancelled seat numbers
      const cancelledSeats = new Set();
      filteredCancellations.forEach((c) => {
        let seats = Array.isArray(c.seat_no)
          ? c.seat_no
          : typeof c.seat_no === 'string'
            ? c.seat_no.split(',').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n))
            : [];
        seats.forEach((seat) => {
          if (seat) cancelledSeats.add(Number(seat));
        });
      });
      
      // Combine regular and guest bookings for seat status
      const allBookings = [...filteredBookings, ...filteredGuestBookings];
      
      // Update seat status based on all bookings
      allBookings.forEach((booking) => {
        const seats = Array.isArray(booking.seat_no)
          ? booking.seat_no
              .map((s) => {
                const num = parseInt(String(s).replace(/[^0-9]/g, ''), 10);
                return isNaN(num) ? null : num;
              })
              .filter((n) => n !== null)
          : typeof booking.seat_no === 'string'
            ? booking.seat_no.split(',').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n))
            : [];
        
        seats.forEach((seat) => {
          if (cancelledSeats.has(seat)) return; // Exclude cancelled seats
          if (String(booking.status).toLowerCase() === 'confirmed') {
            seatStatusMap[seat] = 'reserved';
          } else if (String(booking.status).toLowerCase() === 'processing') {
            seatStatusMap[seat] = 'processing';
          } else if (String(booking.status).toLowerCase() === 'cancelled') {
            seatStatusMap[seat] = 'cancelled';
          }
        });
      });
      
      // Update seat status based on filtered frozen seats
      filteredFrozenSeats.forEach((frozen) => {
        const seatArr = Array.isArray(frozen.seat_no)
          ? frozen.seat_no
              .map((s) => {
                const num = parseInt(String(s).replace(/[^0-9]/g, ''), 10);
                return isNaN(num) ? null : num;
              })
              .filter((n) => n !== null)
          : typeof frozen.seat_no === 'string'
            ? frozen.seat_no.split(',').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n))
            : [];
        
        seatArr.forEach((seat) => {
          if (cancelledSeats.has(seat)) return; // Exclude cancelled seats
          seatStatusMap[seat] = 'freezed';
        });
      });
      
      setSeatStatus(seatStatusMap);
      setIsLoading(false);
    } else {
      setSeatStatus({});
    }
  }, [selectedBusNo, selectedDate, schedules, buses, bookings, frozenSeats, cancellations, guestBookings]);

  // Filter dates by selected bus and prioritize current/future dates
  const getAvailableDates = () => {
    console.log('Selected Bus No:', selectedBusNo);
    console.log('Schedules:', schedules);
    if (!selectedBusNo) {
      console.log('No bus selected, returning empty dates');
      return [];
    }
    const availableDates = schedules
      .filter((schedule) => String(schedule.bus_no) === String(selectedBusNo))
      .map((schedule) => schedule.departure_date)
      .filter((date) => date); // Remove null/undefined dates
    
    // Remove duplicates and convert to Date objects for comparison
    const uniqueDates = [...new Set(availableDates)];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    // Separate dates into categories
    const currentDate = [];
    const futureDates = [];
    const pastDates = [];
    
    uniqueDates.forEach(dateStr => {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      
      if (date.getTime() === today.getTime()) {
        currentDate.push(dateStr);
      } else if (date > today) {
        futureDates.push(dateStr);
      } else {
        pastDates.push(dateStr);
      }
    });
    
    // Sort future and past dates
    futureDates.sort(); // Future dates in ascending order (nearest first)
    pastDates.sort().reverse(); // Past dates in descending order (most recent first)
    
    // Combine in priority order: current, future, past
    const prioritizedDates = [...currentDate, ...futureDates, ...pastDates];
    console.log('Available Dates (prioritized):', prioritizedDates);
    return prioritizedDates;
  };

  // Handle bus selection and auto-select appropriate date
  const handleBusChange = (bus_no) => {
    setSelectedBusNo(bus_no);
    setSelectedDate(''); // Reset date first
    
    // Auto-select the best available date after a short delay to ensure getAvailableDates has updated data
    setTimeout(() => {
      const availableDates = schedules
        .filter((schedule) => String(schedule.bus_no) === String(bus_no))
        .map((schedule) => schedule.departure_date)
        .filter((date) => date);
      
      if (availableDates.length > 0) {
        const uniqueDates = [...new Set(availableDates)];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Find current date
        const todayStr = today.toISOString().split('T')[0];
        const currentDate = uniqueDates.find(dateStr => dateStr === todayStr);
        
        if (currentDate) {
          setSelectedDate(currentDate);
          return;
        }
        
        // Find nearest future date
        const futureDates = uniqueDates
          .filter(dateStr => {
            const date = new Date(dateStr);
            date.setHours(0, 0, 0, 0);
            return date > today;
          })
          .sort();
        
        if (futureDates.length > 0) {
          setSelectedDate(futureDates[0]);
          return;
        }
        
        // Fallback to most recent past date
        const pastDates = uniqueDates
          .filter(dateStr => {
            const date = new Date(dateStr);
            date.setHours(0, 0, 0, 0);
            return date < today;
          })
          .sort()
          .reverse();
        
        if (pastDates.length > 0) {
          setSelectedDate(pastDates[0]);
        }
      }
    }, 100);
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Helper to check permission for Bus Booking
  const hasPermission = (action) => {
    if (!permissions || !permissions['Bus Booking']) return false;
    return !!permissions['Bus Booking'][action];
  };

  // Handle print action
  const handlePrintBtn = () => {
    if (!hasPermission('print')) {
      setNotification("You don't have permission to print bookings.");
      return;
    }
    const filteredBookings = (bookings || []).filter(
      (b) =>
        String(b.bus_no) === String(selectedBusNo) &&
        String(b.departure_date || b.departureDate) === String(selectedDate)
    );
    if (filteredBookings.length) {
      handlePrint();
    }
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow">
          {notification}
          <button className="ml-3 text-red-700 font-bold" onClick={() => setNotification("")}>×</button>
        </div>
      )}
      <div className="flex-grow p-6 overflow-auto">
        {/* Control panel */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <BusSelector
              buses={buses}
              selectedBusNo={selectedBusNo}
              value={selectedBusNo}
              onChange={handleBusChange}
            />
            <DateCalendarSelector
              dates={getAvailableDates()}
              selectedDate={selectedDate}
              onChange={handleDateChange}
              disabled={!selectedBusNo}
            />
          </div>
          <div className="ml-auto">
            <PrintButton
              onClick={handlePrintBtn}
              disabled={!bookings.length || !hasPermission('print')}
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Booking table section */}
          <div className="lg:w-2/3">
            <div ref={printTableRef} style={{ display: 'contents' }}>
              <BookingTable
                bookings={bookings}
                frozenSeats={frozenSeats}
                cancellations={cancellations}
                guestBookings={guestBookings}
                isLoading={isLoading || bookingsLoading || busHookLoading || cancellationsLoading || guestBookingsLoading}
                selectedBusNo={selectedBusNo}
                selectedDate={selectedDate}
                buses={buses}
                onCancelBooking={handleCancelBooking}
              />
            </div>
          </div>

          {/* Bus seat layout section */}
          <div className="lg:w-1/3">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-medium">Bus Seat Layout</h3>
              <BusSeatLayout
                seatStatus={seatStatus}
                isLoading={isLoading}
              />
              <div className="mt-4">
                <SeatLegend />
              </div>
            </div>
          </div>
        </div>

        {/* Debugging Info */}
        {busHookError && (
          <div className="p-4 mt-4 text-red-500">
            Error loading buses or schedules: {busHookError.message}
          </div>
        )}
        {bookingsError && (
          <div className="p-4 mt-4 text-red-500">
            Error loading bookings: {bookingsError.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusBookingPage;