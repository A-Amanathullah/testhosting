import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BusSelector, 
  DateSelector,
  PrintButton,
  ReportPrintLayout
} from '../../components/bus-booking';
import '../../components/bus-booking/print.css';
import useBusHook from '../../../hooks/useBusHook';
import useBookings from '../../../hooks/useBookings';

const BookingReportPage = () => {
  const [selectedBusNo, setSelectedBusNo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableDates, setAvailableDates] = useState([]);
  const printTableRef = useRef(null);

  const { buses, loading: busesLoading } = useBusHook();
  const { bookings: allBookings, loading: bookingsLoading } = useBookings(undefined, undefined);
  const isLoading = busesLoading || bookingsLoading;

  // Compute available dates
  useEffect(() => {
    let filtered = allBookings;
    if (selectedBusNo) {
      filtered = allBookings.filter(b => String(b.bus_no) === String(selectedBusNo));
    }
    const dates = filtered
      .map(b => b.departure_date || b.departureDate)
      .filter(Boolean);
    if (Array.isArray(dates[0])) {
      // dates = dates.flat();
    }
    const uniqueDates = Array.from(new Set(dates)).sort();
    setAvailableDates(uniqueDates);
  }, [allBookings, selectedBusNo]);

  // Compute filtered bookings
  const filteredBookings = useMemo(() => {
    let bookings = selectedBusNo
      ? allBookings.filter(b => String(b.bus_no) === String(selectedBusNo))
      : allBookings;
    if (availableDates.includes(selectedDate)) {
      bookings = bookings.filter(
        b => (b.departure_date || b.departureDate) === selectedDate
      );
    }
    return bookings;
  }, [selectedBusNo, allBookings, selectedDate, availableDates]);

  // Compute confirmed bookings
  const confirmedTableBookings = useMemo(() => {
    return filteredBookings.filter(
      b => String(b.status).toLowerCase() === 'confirmed'
    );
  }, [filteredBookings]);

  // Map bookings for display
  const mappedTableBookings = useMemo(() => {
    return confirmedTableBookings.map(booking => ({
      id: booking.id,
      serialNo: booking.serial_no || '-',
      name: booking.name || '-',
      busNumber: booking.bus_no || booking.busNumber || '-',
      price: booking.price || '-',
      ticketsReserved: booking.reserved_tickets || booking.ticketsReserved || 0,
      seatNumbers: Array.isArray(booking.seat_no) ? booking.seat_no.join(', ') : (booking.seat_no || '-'),
      route: booking.route || `${booking.pickup || ''}${booking.drop ? '-' + booking.drop : ''}` || '-',
      status: booking.status
    }));
  }, [confirmedTableBookings]);

  const handleBusChange = (busNo) => {
    setSelectedBusNo(busNo);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handlePrint = () => {
    if (allBookings.length) {
      if (printTableRef.current) {
        printTableRef.current.focus();
      }
      setTimeout(() => {
        window.print();
      }, 100);
    }
  };

  const selectedBusObj = buses.find(bus => String(bus.bus_no) === String(selectedBusNo));

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      <div className="flex-grow p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Booking Report</h1>
          <p className="text-sm text-gray-500">View and print confirmed bookings.</p>
        </div>
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
        <div className="overflow-hidden bg-white rounded-lg shadow" ref={printTableRef}>
          <ReportPrintLayout
            title="Confirmed Booking Report"
            dateInfo={`Date: ${selectedDate ? new Date(selectedDate).toLocaleDateString() : 'All Dates'}`}
            additionalInfo={[
              `Bus: ${selectedBusNo ? selectedBusObj?.bus_no || 'N/A' : 'All Buses'}`
            ]}
            summaryData={[
              { label: 'Total Bookings', value: mappedTableBookings.length },
              { label: 'Total Seats', value: mappedTableBookings.reduce((sum, booking) => sum + booking.ticketsReserved, 0) }
            ]}
          />
          {isLoading ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Loading booking data...</p>
            </div>
          ) : mappedTableBookings.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">No confirmed bookings found for the selected criteria.</p>
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
                      Total Cost
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Route
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Seat Numbers
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
                        {booking.price}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.route}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.seatNumbers}
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

export default BookingReportPage;