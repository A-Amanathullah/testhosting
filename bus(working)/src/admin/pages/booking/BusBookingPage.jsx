import React, { useState, useEffect, useRef } from 'react';
import {
  BusSelector,
  DateCalendarSelector,
  BookingTable,
  PrintButton,
  BusSeatLayout,
  SeatLegend
} from '../../components/bus-booking';
import '../../components/bus-booking/print.css';
import useBusHook from '../../../hooks/useBusHook';
import useBookings from '../../../hooks/useBookings';

const BusBookingPage = () => {
  // State for selected filters and data
  const [selectedBusNo, setSelectedBusNo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [seatStatus, setSeatStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { buses, trips: schedules, loading: busHookLoading, error: busHookError } = useBusHook();
  const { bookings, frozenSeats, loading: bookingsLoading, error: bookingsError } = useBookings(undefined, undefined);

  // Reference to the table for printing
  const printTableRef = useRef(null);

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

      // Update seat status based on filtered bookings
      filteredBookings.forEach((booking) => {
        const seats = Array.isArray(booking.seat_no)
          ? booking.seat_no
              .map((s) => {
                const num = parseInt(String(s).replace(/[^0-9]/g, ''), 10);
                return isNaN(num) ? null : num;
              })
              .filter((n) => n !== null)
          : [];
        seats.forEach((seat) => {
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
          : [];
        seatArr.forEach((seat) => {
          seatStatusMap[seat] = 'freezed';
        });
      });

      setSeatStatus(seatStatusMap);
      setIsLoading(false);
    } else {
      setSeatStatus({});
    }
  }, [selectedBusNo, selectedDate, schedules, buses, bookings, frozenSeats]);

  // Filter dates by selected bus
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
    console.log('Available Dates:', availableDates);
    return [...new Set(availableDates)].sort(); // Remove duplicates and sort
  };

  // Handle bus selection
  const handleBusChange = (bus_no) => {
    setSelectedBusNo(bus_no);
    setSelectedDate(''); // Reset date when bus changes
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle print action
  const handlePrint = () => {
    const filteredBookings = (bookings || []).filter(
      (b) =>
        String(b.bus_no) === String(selectedBusNo) &&
        String(b.departure_date || b.departureDate) === String(selectedDate)
    );
    if (filteredBookings.length) {
      window.print();
    }
  };

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
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
              onClick={handlePrint}
              disabled={!bookings.length}
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Booking table section */}
          <div className="lg:w-2/3">
            <BookingTable
              bookings={bookings}
              frozenSeats={frozenSeats}
              isLoading={isLoading || bookingsLoading || busHookLoading}
              selectedBusNo={selectedBusNo}
              selectedDate={selectedDate}
              printRef={printTableRef}
              buses={buses}
            />
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