import React, { useState, useEffect, useContext } from "react";
import { BusSelector, DateCalendarSelector } from "../../components/bus-booking";
import FreezingTable from "../../components/seat-freezing/FreezingTable";
import FreezingSeatSelector from "../../components/seat-freezing/FreezingSeatSelector";
import FreezingForm from "../../components/seat-freezing/FreezingForm";
import UnfreezeConfirmation from "../../components/seat-freezing/UnfreezeConfirmation";
import { createBooking } from '../../../services/bookingService';
import { AuthContext } from '../../../context/AuthContext';
import useBusHook from '../../../hooks/useBusHook';
import useBookings from '../../../hooks/useBookings';
import useAdminGuestBookings from '../../hooks/useAdminGuestBookings';
import { usePermissions } from '../../../context/PermissionsContext';
import { normalizeToYYYYMMDD } from '../../../utils/dateUtils';
import axios from 'axios';
const API_URL = "http://localhost:8000/api";

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

const FreezingSeatPage = () => {
  const [selectedBusNo, setselectedBusNo] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [seatStatus, setSeatStatus] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);

  // state for modals
  const [isUnfreezeModalOpen, setIsUnfreezeModalOpen] = useState(false);
  const [seatsToUnfreeze, setSeatsToUnfreeze] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const { user } = useContext(AuthContext);
  const { permissions } = usePermissions();

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const { buses, trips: schedules, loading: busHookLoading } = useBusHook();
  const selectedBusObj = buses.find(bus => String(bus.bus_no) === String(selectedBusNo));
  const selectedBusId = selectedBusObj?.id;
  const { bookings, frozenSeats, loading: bookingsLoading } = useBookings(selectedBusId, selectedDate, refreshKey);
  const { guestBookings, loading: guestBookingsLoading } = useAdminGuestBookings(selectedBusNo, selectedDate);
  
  // Filter buses to only show those that have scheduled trips
  const busesWithTrips = buses.filter(bus => {
    return schedules.some(schedule => String(schedule.bus_no) === String(bus.bus_no));
  });
  
  // Reset selected bus if it's not available in the filtered buses list
  useEffect(() => {
    if (selectedBusNo && busesWithTrips.length > 0) {
      const isSelectedBusAvailable = busesWithTrips.some(bus => String(bus.bus_no) === String(selectedBusNo));
      if (!isSelectedBusAvailable) {
        setselectedBusNo('');
        setSelectedDate('');
        setSelectedSeats([]);
      }
    }
  }, [selectedBusNo, busesWithTrips]);


  
  useEffect(() => {
    // Find bus info based on bus_no
    const busInfo = buses.find(bus => String(bus.bus_no) === String(selectedBusNo));
    const selectedBusId = busInfo?.id;

    if (selectedBusNo && selectedDate && busInfo) {
      setIsLoading(true);
      
      // Generate seat status map
      const seatStatusMap = {};
      for (let i = 1; i <= (busInfo?.total_seats || 0); i++) {
        seatStatusMap[i] = 'available';
      }

      // Use normalized date for comparisons
      const normalizedSelectedDate = normalizeToYYYYMMDD(selectedDate);

      // Filter frozen seats
      const filteredFrozenSeats = (frozenSeats || []).filter(f => {
        const normalizedFrozenDate = normalizeToYYYYMMDD(f.departure_date || f.departureDate);
        const busMatch = String(f.bus_no) === String(selectedBusNo) || 
                       (busInfo && String(f.bus_id) === String(busInfo.id));
        const dateMatch = normalizedFrozenDate === normalizedSelectedDate;
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

      // Filter bookings by bus and date
      const filteredBookings = (bookings || []).filter(b => {
        const normalizedBookingDate = normalizeToYYYYMMDD(b.departure_date || b.departureDate);
        const busMatch = String(b.bus_id) === String(selectedBusId) || String(b.bus_no) === String(selectedBusNo);
        const dateMatch = normalizedBookingDate === normalizedSelectedDate;
        return busMatch && dateMatch;
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

      // Filter guest bookings
      const filteredGuestBookings = (guestBookings || []).filter(g => {
        if (!g) return false;
        
        const normalizedGuestDate = normalizeToYYYYMMDD(g.departure_date);
        const busMatch = String(g.bus_no) === String(selectedBusNo) || 
                       (busInfo && String(g.bus_id) === String(busInfo.id));
        const dateMatch = normalizedGuestDate === normalizedSelectedDate;
        
        return busMatch && dateMatch;
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
  }, [selectedBusNo, selectedDate, schedules, buses, bookings, frozenSeats, guestBookings]);

  // Filter dates by selected bus and prioritize current/future dates
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
    setselectedBusNo(bus_no);
    setSelectedDate(""); // Reset date first
    setSelectedSeats([]); // Clear selected seats
    
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
    setSelectedSeats([]); // Clear selected seats
  };

  // Handle seat selection/deselection
  const handleSeatSelect = (seatNumber) => {
    // Allow selecting frozen seats for unfreezing, but not for freezing
    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.includes(seatNumber);
      const isFrozen = seatStatus[seatNumber] === "freezed";
      if (isFrozen) {
        // If already selected, allow unselecting (for unfreeze)
        if (isAlreadySelected) {
          return prev.filter((seat) => seat !== seatNumber);
        } else {
          // Allow selecting frozen seats for unfreezing
          return [...prev, seatNumber];
        }
      } else {
        // For non-frozen seats, normal toggle
        if (isAlreadySelected) {
          return prev.filter((seat) => seat !== seatNumber);
        } else {
          return [...prev, seatNumber];
        }
      }
    });
  };

  // Handle form submission for freezing seats
  const handleFreezeSubmit = async (formData) => {
    if (!can('add')) {
      setNotification({
        message: 'You do not have permission to freeze seats.',
        type: 'error'
      });
      return;
    }
    if (selectedSeats.length === 0) return;
    // Prevent freezing already frozen seats
    const alreadyFrozen = selectedSeats.filter(seat => seatStatus[seat] === "freezed");
    if (alreadyFrozen.length > 0) {
      setNotification({
        message: `Seat(s) ${alreadyFrozen.join(', ')} already frozen. Unfreeze first if needed.`,
        type: 'error'
      });
      return;
    }
    if (!user) {
      setNotification({
        message: 'User not authenticated',
        type: 'error'
      });
      return;
    }
    if (!selectedBusObj || !selectedDate) {
      setNotification({
        message: 'Please select bus and date',
        type: 'error'
      });
      return;
    }
    setIsLoading(true);
    const now = new Date();
    const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, "");
    const rand = Math.floor(100 + Math.random() * 900);
    const serialNo = `FRZ-${yymmdd}-${rand}`;
    try {
      // Ensure seat_no is sent as S-prefixed labels
      const seatNoString = selectedSeats
        .map(seat => {
          const seatStr = String(seat).trim();
          return seatStr.startsWith('S') ? seatStr : `S${seatStr}`;
        })
        .join(",");
      await createBooking({
        user_id: user.id,
        bus_id: selectedBusObj.id,
        bus_no: selectedBusObj.bus_no,
        serial_no: serialNo,
        name: user.name,
        reserved_tickets: selectedSeats.length,
        seat_no: seatNoString,
        pickup: '-',
        drop: '-',
        role: user.role,
        payment_status: 'N/A',
        status: 'freezed',
        departure_date: selectedDate,
        booked_date: now.toISOString().slice(0, 10),
        reason: formData.reason,
      }, user.token);
      // Update seat status locally
      const updatedSeatStatus = { ...seatStatus };
      selectedSeats.forEach((seatNumber) => {
        updatedSeatStatus[seatNumber] = "freezed";
      });
      setSeatStatus(updatedSeatStatus);
      setSelectedSeats([]);
      setIsLoading(false);
      setRefreshKey((k) => k + 1); // Trigger reload for table
      setNotification({
        message: `Successfully frozen ${selectedSeats.length} seat(s).`,
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: "Freezing failed: " + (err.response?.data?.message || err.message),
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  // Handle unfreeze request from form button
  const handleUnfreezeRequest = (seatsToUnfreeze) => {
    if (!can('edit')) {
      setNotification({
        message: 'You do not have permission to unfreeze seats.',
        type: 'error'
      });
      return;
    }
    // Check if any of the selected seats are actually frozen
    const frozenSelectedSeats = selectedSeats.filter(seatNumber => 
      seatStatus[seatNumber] === "freezed"
    );
    
    if (frozenSelectedSeats.length === 0) {
      // If no frozen seats are selected, show a message or alert
      setNotification({
        message: "None of the selected seats are frozen. Please select frozen seats to unfreeze.",
        type: 'error'
      });
      return;
    }
    
    // Store the seats to unfreeze and open confirmation modal
    setSeatsToUnfreeze(frozenSelectedSeats);
    setIsUnfreezeModalOpen(true);
  };

  // Handle unfreeze confirmation
  const handleUnfreeze = async (seatNumbers) => {
    setIsLoading(true);
    try {
      // Group seatNumbers by booking
      const seatToBookingMap = {};
      for (const seat of seatNumbers) {
        const booking = frozenSeats.find(b => {
          if (!b.seat_no) return false;
          
          // Convert seat numbers to a standard format for comparison
          const bookingSeatNumbers = parseSeatNumbers(b.seat_no);
          const searchSeatNumber = parseInt(String(seat).replace(/[^0-9]/g, ''), 10);
          
          return bookingSeatNumbers.includes(searchSeatNumber);
        });
        
        if (booking) {
          if (!seatToBookingMap[booking.id]) seatToBookingMap[booking.id] = { booking, seats: [] };
          // Always push S-prefixed seat
          const seatStr = String(seat).trim();
          seatToBookingMap[booking.id].seats.push(seatStr.startsWith('S') ? seatStr : `S${seatStr}`);
        }
      }
      // For each booking, remove all selected seats at once
      for (const { booking, seats } of Object.values(seatToBookingMap)) {
        // Get all seat numbers as strings with 'S' prefix
        let seatArr = [];
        if (Array.isArray(booking.seat_no)) {
          seatArr = booking.seat_no.map(s => {
            const sStr = String(s).trim();
            return sStr.startsWith('S') ? sStr : `S${sStr}`;
          });
        } else if (typeof booking.seat_no === 'string') {
          seatArr = booking.seat_no.split(',').map(s => {
            const sStr = s.trim();
            return sStr.startsWith('S') ? sStr : `S${sStr}`;
          });
        }
        
        // Ensure seatsToRemove are also S-prefixed
        const seatsToRemove = seats.map(s => {
          const sStr = String(s).trim();
          return sStr.startsWith('S') ? sStr : `S${sStr}`;
        });
        if (seatArr.length === seats.length) {
          // All seats selected, delete booking
          await axios.delete(`${API_URL}/bookings/${booking.id}`, {
            headers: {
              'Content-Type': 'application/json',
              ...(user?.token && { Authorization: `Bearer ${user.token}` }),
            },
          });
        } else {
          // Remove all selected seats from booking
          const newSeats = seatArr.filter(s => !seatsToRemove.includes(s));
          await axios.put(`${API_URL}/bookings/${booking.id}`, {
            ...booking,
            seat_no: newSeats.join(','),
            reserved_tickets: newSeats.length,
          }, {
            headers: {
              'Content-Type': 'application/json',
              ...(user?.token && { Authorization: `Bearer ${user.token}` }),
            },
          });
        }
      }
      setRefreshKey(k => k + 1); // Refresh data
      setSelectedSeats([]);
      setIsUnfreezeModalOpen(false);
      setSeatsToUnfreeze([]);
      setNotification({
        message: `Successfully unfrozen ${seatNumbers.length} seat(s).`,
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Unfreeze failed: ' + (err.response?.data?.message || err.message),
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to check permissions for Freezing Seat
  const can = (action) => {
    if (!permissions || !permissions['Freezing Seat']) return false;
    return !!permissions['Freezing Seat'][action];
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      {/* Notification */}
      {notification.message && (
        <div className={`mx-6 mt-4 p-4 rounded-md ${
          notification.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="flex-grow p-6 overflow-auto">
        {/* Control panel - Replace DateSelector with DateCalendarSelector */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <BusSelector
            buses={busesWithTrips}
            selectedBusNo={selectedBusNo}
            onChange={handleBusChange}
            value={selectedBusNo}
          />
          <DateCalendarSelector
            dates={getAvailableDates()}
            selectedDate={selectedDate}
            onChange={handleDateChange}
            disabled={!selectedBusNo}
          />
        </div>

        {/* Main content area */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column: Freezing Form and Frozen Seats Table */}
          <div className="flex flex-col gap-6">
            {/* Top Left: Freezing Form */}
            <FreezingForm
              selectedSeats={selectedSeats}
              onSubmit={handleFreezeSubmit}
              onUnfreeze={handleUnfreezeRequest}
              isSubmitting={isLoading || bookingsLoading || busHookLoading || guestBookingsLoading}
              disabled={
                !selectedBusNo || !selectedDate || selectedSeats.length === 0
              }
            />
            
            {/* Bottom Left: Frozen Seats Table */}
            <FreezingTable
              key={selectedBusId + '-' + selectedDate + '-' + refreshKey}
              frozenSeats={frozenSeats}
              isLoading={isLoading || bookingsLoading || busHookLoading || guestBookingsLoading}
              busId={selectedBusId}
              date={selectedDate}
            />
          </div>
          
          {/* Right Column: Seat Selection */}
          <div>
            <FreezingSeatSelector
              seatStatus={seatStatus}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              isLoading={isLoading || bookingsLoading || busHookLoading || guestBookingsLoading}
              disabled={!selectedBusNo || !selectedDate}
              totalSeats={selectedBusObj?.total_seats || 44}
            />
          </div>
        </div>

        {/* Unfreeze confirmation modal */}
        <UnfreezeConfirmation
          isOpen={isUnfreezeModalOpen}
          onClose={() => setIsUnfreezeModalOpen(false)}
          onConfirm={handleUnfreeze}
          frozenSeatInfo={{
            seatNumbers: seatsToUnfreeze
          }}
        />
      </div>
    </div>
  );
};

export default FreezingSeatPage;