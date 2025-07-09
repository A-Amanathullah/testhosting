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
import useAdminGuestBookings from '../../../admin/hooks/useAdminGuestBookings';
import { normalizeToYYYYMMDD } from '../../../utils/dateUtils';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper function to parse seat numbers from any format (string, array, comma-separated)
const parseSeatNumbers = (seatData) => {
  if (!seatData) return [];
  
  if (Array.isArray(seatData)) {
    return seatData.map(seat => {
      const num = parseInt(String(seat).replace(/[^0-9]/g, ''), 10);
      return isNaN(num) ? null : num;
    }).filter(Boolean);
  } 
  
  if (typeof seatData === "string") {
    return seatData.split(",").map(seat => {
      const num = parseInt(seat.replace(/[^0-9]/g, ''), 10);
      return isNaN(num) ? null : num;
    }).filter(Boolean);
  }
  
  return [];
};

// Helper function to validate date strings
const isValidDateStr = (dateStr) => {
  if (!dateStr) return false;
  
  // Check if it's a properly formatted date string (yyyy-MM-dd)
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  // Split the date string and check components
  const [year, month, day] = dateStr.split('-').map(Number);
  
  // Basic validation for month and day ranges
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  
  // Verify it's a valid date (not like 2023-02-31)
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
};

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

  // Filter buses to only show those that have scheduled trips
  const busesWithTrips = buses.filter(bus => {
    return schedules.some(schedule => String(schedule.bus_no) === String(bus.bus_no));
  });

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

  // Reset selected bus if it's not available in the filtered buses list
  useEffect(() => {
    if (selectedBusNo && busesWithTrips.length > 0) {
      const isSelectedBusAvailable = busesWithTrips.some(bus => String(bus.bus_no) === String(selectedBusNo));
      if (!isSelectedBusAvailable) {
        setSelectedBusNo('');
        setSelectedDate('');
      }
    }
  }, [selectedBusNo, busesWithTrips]);

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
    // Find bus info based on bus_no
    const busInfo = buses.find(bus => String(bus.bus_no) === String(selectedBusNo));
    
    if (selectedBusNo && selectedDate && busInfo) {
      setIsLoading(true);
      
      // Generate seat status map
      const seatStatusMap = {};
      for (let i = 1; i <= (busInfo?.total_seats || 0); i++) {
        seatStatusMap[i] = 'available';
      }
      
      // Use normalized date for comparisons
      const normalizedSelectedDate = normalizeToYYYYMMDD(selectedDate);
      
      // Filter by bus_no and date
      const filteredBookings = (bookings || []).filter(b => {
        const normalizedBookingDate = normalizeToYYYYMMDD(b.departure_date || b.departureDate);
        const busMatch = String(b.bus_no) === String(selectedBusNo);
        const dateMatch = normalizedBookingDate === normalizedSelectedDate;
        return busMatch && dateMatch;
      });
      
      const filteredFrozenSeats = (frozenSeats || []).filter(f => {
        const normalizedFrozenDate = normalizeToYYYYMMDD(f.departure_date || f.departureDate);
        const busMatch = String(f.bus_no) === String(selectedBusNo);
        const dateMatch = normalizedFrozenDate === normalizedSelectedDate;
        return busMatch && dateMatch;
      });
      
      const filteredGuestBookings = (guestBookings || []).filter(g => {
        if (!g) return false;
        
        const normalizedGuestDate = normalizeToYYYYMMDD(g.departure_date);
        const busMatch = String(g.bus_no) === String(selectedBusNo) || 
                       (busInfo && String(g.bus_id) === String(busInfo.id));
        const dateMatch = normalizedGuestDate === normalizedSelectedDate;
        
        return busMatch && dateMatch;
      });
      
      // Process frozen seats first (lowest priority)
      filteredFrozenSeats.forEach((frozen) => {
        const seatNumbers = parseSeatNumbers(frozen.seat_no);
        
        seatNumbers.forEach((seatNum) => {
          if (seatNum && seatStatusMap[seatNum]) {
            seatStatusMap[seatNum] = 'freezed';
          }
        });
      });
      
      // Process regular bookings (higher priority than frozen seats)
      filteredBookings.forEach((booking) => {
        // Skip cancelled bookings in the seat layout visualization
        if (String(booking.status).toLowerCase() === 'cancelled') {
          return;
        }
        
        const seatNumbers = parseSeatNumbers(booking.seat_no);
        
        seatNumbers.forEach((seatNum) => {
          if (seatNum && seatStatusMap[seatNum]) {
            // Apply status based on booking status
            if (String(booking.status).toLowerCase() === 'confirmed') {
              seatStatusMap[seatNum] = 'reserved';
            } else if (String(booking.status).toLowerCase() === 'processing') {
              seatStatusMap[seatNum] = 'processing';
            }
          }
        });
      });
      
      // Process guest bookings (highest priority)
      filteredGuestBookings.forEach((guestBooking) => {
        // Skip cancelled guest bookings in the seat layout visualization
        if (String(guestBooking.status).toLowerCase() === 'cancelled') {
          return;
        }
        
        const seatNumbers = parseSeatNumbers(guestBooking.seat_no);
        
        seatNumbers.forEach((seatNum) => {
          if (seatNum && seatStatusMap[seatNum]) {
            // Apply status based on guest booking status
            if (String(guestBooking.status).toLowerCase() === 'processing') {
              // Guest processing bookings use the same color as regular processing
              seatStatusMap[seatNum] = 'processing';
            } else {
              // Confirmed or other guest bookings use guest color
              seatStatusMap[seatNum] = 'guest';
            }
          }
        });
      });
      
      // Update the state
      setSeatStatus(seatStatusMap);
      setIsLoading(false);
    } else {
      setSeatStatus({});
    }
  }, [selectedBusNo, selectedDate, buses, bookings, frozenSeats, cancellations, guestBookings]);

  // Filter dates by selected bus and prioritize current/future dates
  const getAvailableDates = () => {
    if (!selectedBusNo) {
      return [];
    }
    
    const availableDates = schedules
      .filter((schedule) => String(schedule.bus_no) === String(selectedBusNo))
      .map((schedule) => {
        const normalizedDate = normalizeToYYYYMMDD(schedule.departure_date);
        if (normalizedDate) {
          return normalizedDate;
        }
        return null;
      })
      .filter(date => date !== null); // Remove null/undefined dates
    
    // Remove duplicates
    const uniqueDates = [...new Set(availableDates)];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    // Separate dates into categories
    const currentDate = [];
    const futureDates = [];
    const pastDates = [];
    
    uniqueDates.forEach(dateStr => {
      try {
        if (!isValidDateStr(dateStr)) {
          return; // Skip this iteration
        }
        
        // Parse date components manually for better validation
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setHours(0, 0, 0, 0);
        
        const todayTime = today.getTime();
        const dateTime = date.getTime();
        
        if (dateTime === todayTime) {
          currentDate.push(dateStr);
        } else if (date > today) {
          futureDates.push(dateStr);
        } else {
          pastDates.push(dateStr);
        }
      } catch (error) {
        // Skip this date if it causes an error
      }
    });
    
    // Sort future and past dates
    futureDates.sort(); // Future dates in ascending order (nearest first)
    pastDates.sort().reverse(); // Past dates in descending order (most recent first)
    
    // Combine in priority order: current, future, past
    const prioritizedDates = [...currentDate, ...futureDates, ...pastDates];
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
        .map((schedule) => normalizeToYYYYMMDD(schedule.departure_date))
        .filter(date => date !== null); // Remove null/undefined dates
      
      if (availableDates.length > 0) {
        const uniqueDates = [...new Set(availableDates)];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Find current date - use our manual date formatting
        const todayMonth = today.getMonth() + 1; // getMonth() is 0-based
        const todayStr = `${today.getFullYear()}-${todayMonth < 10 ? '0' + todayMonth : todayMonth}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`;
        const currentDate = uniqueDates.find(dateStr => dateStr === todayStr);
        
        if (currentDate) {
          setSelectedDate(currentDate);
          return;
        }
        
        // Find nearest future date
        const futureDates = uniqueDates
          .filter(dateStr => {
            if (!isValidDateStr(dateStr)) return false;
            try {
              // Parse date components manually for better validation
              const [year, month, day] = dateStr.split('-').map(Number);
              const date = new Date(year, month - 1, day);
              date.setHours(0, 0, 0, 0);
              return date > today;
            } catch {
              return false;
            }
          })
          .sort();
        
        if (futureDates.length > 0) {
          setSelectedDate(futureDates[0]);
          return;
        }
        
        // Fallback to most recent past date
        const pastDates = uniqueDates
          .filter(dateStr => {
            if (!isValidDateStr(dateStr)) return false;
            try {
              // Parse date components manually for better validation
              const [year, month, day] = dateStr.split('-').map(Number);
              const date = new Date(year, month - 1, day);
              date.setHours(0, 0, 0, 0);
              return date < today;
            } catch {
              return false;
            }
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
              buses={busesWithTrips}
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