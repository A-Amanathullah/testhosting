import React, { useState, useEffect, useRef } from 'react';
import { 
  BusSelector, 
  DateSelector,
  PrintButton,
  ReportPrintLayout
} from '../../components/bus-booking';
import '../../components/bus-booking/print.css';
import useBusHook from '../../../hooks/useBusHook';
import useBookings from '../../../hooks/useBookings';

const CancellationReportPage = () => {
  // State for selected filters and data
  const [selectedBusNo, setSelectedBusNo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  // Reference to the table for printing
  const printTableRef = useRef(null);

  // Fetch buses using hook
  const { buses, loading: busesLoading } = useBusHook();
  // Always call hooks in the same order
  const { bookings: allBookings, loading: bookingsLoading } = useBookings();

  const isLoading = busesLoading || bookingsLoading;

  // Generate available dates from allBookings
  useEffect(() => {
    if (allBookings && allBookings.length > 0) {
      let allDates = allBookings
        .map(b => b.departure_date || b.departureDate)
        .filter(Boolean);
      if (Array.isArray(allDates[0])) {
        allDates = allDates.flat();
      }
      const uniqueDates = Array.from(new Set(allDates)).sort();
      setAvailableDates(uniqueDates);
    } else {
      setAvailableDates([]);
    }
  }, [allBookings]);

  // Step 1: Filter by bus if selected
  let filteredBookings = selectedBusNo
    ? allBookings.filter(b => String(b.bus_no) === String(selectedBusNo))
    : allBookings;

  // Step 2: Extract available dates from filtered bookings
  useEffect(() => {
    const dates = filteredBookings
      .map(b => b.departure_date || b.departureDate)
      .filter(Boolean);
    const uniqueDates = Array.from(new Set(dates)).sort();
    setAvailableDates(uniqueDates);
  }, [selectedBusNo, allBookings, filteredBookings]);

  // Step 3: Filter by date if selected
  const isUserDateSelected = availableDates.includes(selectedDate);
  if (isUserDateSelected) {
    filteredBookings = filteredBookings.filter(
      b => (b.departure_date || b.departureDate) === selectedDate
    );
  }

  // Only show cancelled bookings
  const cancelledBookings = filteredBookings.filter(
    b => String(b.status).toLowerCase() === 'cancelled'
  );

  // Map for table
  const mappedTableBookings = cancelledBookings.map(booking => ({
    id: booking.id,
    serialNo: booking.serial_no || '-',
    name: booking.name || '-',
    busNumber: booking.bus_no || booking.busNumber || '-',
    costForSeats: booking.price || booking.cost || '-',
    ticketsReserved: booking.reserved_tickets || booking.ticketsReserved || 0,
    seatNumbers: Array.isArray(booking.seat_no) ? booking.seat_no.join(', ') : (booking.seat_no || '-'),
    route: booking.route || `${booking.pickup || ''}${booking.drop ? '-' + booking.drop : ''}` || '-',
    cancellationDate: booking.booked_date || booking.booked_date || null,
    cancellationReason: booking.reason || booking.cancellationReason || null,
    status: booking.status
  }));

  // Handle bus selection
  const handleBusChange = (busNo) => {
    setSelectedBusNo(busNo);
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle print action
  const handlePrint = () => {
    if (mappedTableBookings.length) {
      if (printTableRef.current) {
        printTableRef.current.focus();
      }
      setTimeout(() => {
        window.print();
      }, 100);
    }
  };

  // Helper: Map bus_no to bus object
  const selectedBusObj = buses.find(bus => String(bus.bus_no) === String(selectedBusNo));

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cancellation Report</h1>
          <p className="text-sm text-gray-500">View and print cancelled bookings.</p>
        </div>

        {/* Control panel */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <BusSelector 
              buses={buses} 
              selectedBusNo={selectedBusNo} 
              onChange={handleBusChange} 
            />
            <DateSelector 
              dates={availableDates} 
              selectedDate={selectedDate} 
              onChange={handleDateChange}
            />
          </div>
          <div className="ml-auto">
            <PrintButton 
              onClick={handlePrint}
              disabled={!mappedTableBookings.length}
            />
          </div>
        </div>
        {/* Cancellation Report Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow" ref={printTableRef}>
          <ReportPrintLayout
            title="Cancellation Report"
            dateInfo={`Date: ${selectedDate ? new Date(selectedDate).toLocaleDateString() : 'All Dates'}`}
            additionalInfo={[
              `Bus: ${selectedBusNo ? selectedBusObj?.bus_no || 'N/A' : 'All Buses'}`
            ]}
            summaryData={[
              { label: 'Total Cancellations', value: mappedTableBookings.length },
              { label: 'Total Cancelled Seats', value: mappedTableBookings.reduce((sum, booking) => sum + booking.ticketsReserved, 0) },
              { 
                label: 'Most Common Reason', 
                value: mappedTableBookings.length > 0 
                  ? (
                    Object.entries(
                      mappedTableBookings.reduce((acc, booking) => {
                        const reason = booking.cancellationReason || 'Unknown';
                        acc[reason] = (acc[reason] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort((a, b) => b[1] - a[1])[0][0]
                  ) 
                  : 'N/A'
              }
            ]}
          />
          {isLoading ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Loading cancellation data...</p>
            </div>
          ) : mappedTableBookings.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">No cancelled bookings found for the selected criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto print-table print-content">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Serial No.
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Bus No.
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Cost for seats
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Route
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Seat Numbers
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Cancellation Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mappedTableBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.serialNo}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.busNumber}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.costForSeats}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.route}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.seatNumbers}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.cancellationDate ? new Date(booking.cancellationDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {booking.cancellationReason || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancellationReportPage;