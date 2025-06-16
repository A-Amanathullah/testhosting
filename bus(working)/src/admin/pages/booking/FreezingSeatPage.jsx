import React, { useState, useEffect, useContext } from "react";
import { BusSelector, DateCalendarSelector } from "../../components/bus-booking";
import FreezingTable from "../../components/seat-freezing/FreezingTable";
import FreezingSeatSelector from "../../components/seat-freezing/FreezingSeatSelector";
import FreezingForm from "../../components/seat-freezing/FreezingForm";
import UnfreezeConfirmation from "../../components/seat-freezing/UnfreezeConfirmation";
import { createBooking } from '../../../services/bookingService';
import { AuthContext } from '../../../context/AuthContext';
import useBusHook from '../../../hooks/useBusHook';
import useBookings from '../../../hooks/useBookings'; // <-- Add this import
import axios from 'axios';
const API_URL = "http://localhost:8000/api";

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

  const { user } = useContext(AuthContext);
  const { buses, trips: schedules } = useBusHook();
  const selectedBusObj = buses.find(bus => String(bus.bus_no) === String(selectedBusNo));
  const selectedBusId = selectedBusObj?.id;
  const { bookings, frozenSeats, loading: bookingsLoading } = useBookings(selectedBusId, selectedDate, refreshKey);


  
  useEffect(() => {
    const busInfo = buses.find((bus) => bus.bus_no === selectedBusNo);
    const selectedBusId = busInfo?.id;

    if (selectedBusNo && selectedDate && busInfo) {
      const seatStatusMap = {};
      for (let i = 1; i <= busInfo.total_seats; i++) {
        seatStatusMap[i] = "available";
      }

      // Defensive filtering: only use frozenSeats for selected bus and date
      const filteredFrozenSeats = (frozenSeats || []).filter(
        f => String(f.bus_no) === String(selectedBusNo) &&
             String(f.departure_date || f.departureDate) === String(selectedDate)
      );

      filteredFrozenSeats.forEach(frozen => {
        // seat_no is now always an array
        const seatArr = (Array.isArray(frozen.seat_no)
          ? frozen.seat_no.map(s => {
              const num = parseInt(String(s).replace(/[^0-9]/g, ''), 10);
              return isNaN(num) ? null : num;
            }).filter(n => n !== null)
          : []);
        seatArr.forEach(seat => {
          seatStatusMap[seat] = 'freezed';
        });
      });

      // Defensive filtering: only use bookings for selected bus and date
      const filteredBookings = (bookings || []).filter(booking => {
        return String(booking.bus_id) === String(selectedBusId) && String(booking.departure_date) === String(selectedDate);
      });
      filteredBookings.forEach(booking => {
        let seats = [];
        if (Array.isArray(booking.seat_no)) {
          seats = booking.seat_no.map(s => parseInt(String(s).replace(/[^0-9]/g, ""), 10)).filter(n => !isNaN(n));
        } else if (typeof booking.seat_no === "string") {
          seats = booking.seat_no.split(',').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n));
        }
        seats.forEach(seat => {
          if (String(booking.status).toLowerCase() === 'confirmed') {
            seatStatusMap[seat] = 'reserved';
          } else if (String(booking.status).toLowerCase() === 'processing') {
            seatStatusMap[seat] = 'processing';
          } else if (String(booking.status).toLowerCase() === 'cancelled') {
            seatStatusMap[seat] = 'cancelled';
          }
        });
      });

      setSeatStatus(seatStatusMap);
    } else {
      setSeatStatus({});
    }
  }, [selectedBusNo, selectedDate, schedules, buses, bookings, frozenSeats]);

  // Filter dates by selected bus
  const getAvailableDates = () => {
    if (!selectedBusNo) return [];
    return schedules
      .filter((schedule) => schedule.bus_no === selectedBusNo)  
      .map((schedule) => schedule.departure_date);
  };

  // Handle bus selection
  const handleBusChange = (bus_no) => {
    setselectedBusNo(bus_no);
    setSelectedDate(""); // Reset date when bus changes
    setSelectedSeats([]); // Clear selected seats
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
    if (selectedSeats.length === 0) return;
    // Prevent freezing already frozen seats
    const alreadyFrozen = selectedSeats.filter(seat => seatStatus[seat] === "freezed");
    if (alreadyFrozen.length > 0) {
      alert(`Seat(s) ${alreadyFrozen.join(', ')} already frozen. Unfreeze first if needed.`);
      return;
    }
    if (!user) {
      alert('User not authenticated');
      return;
    }
    if (!selectedBusObj || !selectedDate) {
      alert('Please select bus and date');
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
    } catch (err) {
      alert("Freezing failed: " + (err.response?.data?.message || err.message));
      setIsLoading(false);
    }
  };

  // Handle unfreeze request from form button
  const handleUnfreezeRequest = (seatsToUnfreeze) => {
    // Check if any of the selected seats are actually frozen
    const frozenSelectedSeats = selectedSeats.filter(seatNumber => 
      seatStatus[seatNumber] === "freezed"
    );
    
    if (frozenSelectedSeats.length === 0) {
      // If no frozen seats are selected, show a message or alert
      alert("None of the selected seats are frozen. Please select frozen seats to unfreeze.");
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
          let seatArr = [];
          if (Array.isArray(b.seat_no)) {
            seatArr = b.seat_no.map(s => {
              const sStr = String(s).trim();
              return sStr.startsWith('S') ? sStr : `S${sStr}`;
            });
          } else if (typeof b.seat_no === 'string') {
            seatArr = b.seat_no.split(',').map(s => {
              const sStr = s.trim();
              return sStr.startsWith('S') ? sStr : `S${sStr}`;
            });
          }
          // Also S-prefix the seat being searched
          const seatStr = String(seat).trim();
          const searchSeat = seatStr.startsWith('S') ? seatStr : `S${seatStr}`;
          return seatArr.includes(searchSeat);
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
    } catch (err) {
      alert('Unfreeze failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        {/* Control panel - Replace DateSelector with DateCalendarSelector */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <BusSelector
            buses={buses}
            selectedBusNo={selectedBusNo}
            onChange={handleBusChange}
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
              isSubmitting={isLoading || bookingsLoading}
              disabled={
                !selectedBusNo || !selectedDate || selectedSeats.length === 0
              }
            />
            
            {/* Bottom Left: Frozen Seats Table */}
            <FreezingTable
              key={selectedBusId + '-' + selectedDate + '-' + refreshKey}
              frozenSeats={frozenSeats}
              isLoading={isLoading || bookingsLoading}
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
              isLoading={isLoading || bookingsLoading}
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