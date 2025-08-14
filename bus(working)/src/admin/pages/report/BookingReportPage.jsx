import React, { useState, useEffect, useRef, useMemo } from 'react';
import Pagination from '../../components/Pagination';
import { usePermissions } from '../../../context/PermissionsContext';
import { 
  BusSelector, 
  DateSelector,
  PrintButton,
  ReportPrintLayout
} from '../../components/bus-booking';
// import PrintLogoHeader from '../../components/bus-booking/PrintLogoHeader';
import '../../components/bus-booking/print.css';
import useBusHook from '../../../hooks/useBusHook';
import useBookings from '../../../hooks/useBookings';
import useAdminGuestBookings from '../../hooks/useAdminGuestBookings';

const BookingReportPage = () => {
  const [selectedBusNo, setSelectedBusNo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableDates, setAvailableDates] = useState([]);
  const [notification, setNotification] = useState("");
  const printTableRef = useRef(null);

  const { buses, loading: busesLoading } = useBusHook();
  const { bookings: allBookings, loading: bookingsLoading } = useBookings(undefined, undefined);
  const { guestBookings: allGuestBookings, loading: guestBookingsLoading } = useAdminGuestBookings(undefined, undefined);
  const { permissions } = usePermissions();
  const isLoading = busesLoading || bookingsLoading || guestBookingsLoading;

  // Compute available dates
  useEffect(() => {
    let filtered = allBookings;
    if (selectedBusNo) {
      filtered = allBookings.filter(b => String(b.bus_no) === String(selectedBusNo));
    }
    
    // Include guest bookings in date calculation
    let guestFiltered = allGuestBookings;
    if (selectedBusNo) {
      guestFiltered = allGuestBookings.filter(b => String(b.bus_no) === String(selectedBusNo));
    }
    
    const regularDates = filtered
      .map(b => b.departure_date || b.departureDate)
      .filter(Boolean);
    
    const guestDates = guestFiltered
      .map(b => b.departure_date || b.departureDate)
      .filter(Boolean);
    
    // Combine both date arrays
    const allDates = [...regularDates, ...guestDates];
    
    if (Array.isArray(allDates[0])) {
      // dates = dates.flat();
    }
    const uniqueDates = Array.from(new Set(allDates)).sort();
    setAvailableDates(uniqueDates);
  }, [allBookings, allGuestBookings, selectedBusNo]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  // Compute filtered bookings
  const filteredBookings = useMemo(() => {
    let bookings = selectedBusNo
      ? allBookings.filter(b => String(b.bus_no) === String(selectedBusNo))
      : allBookings;
    
    // Filter guest bookings by bus number
    let guestBookings = selectedBusNo
      ? allGuestBookings.filter(b => String(b.bus_no) === String(selectedBusNo))
      : allGuestBookings;
      
    if (availableDates.includes(selectedDate)) {
      bookings = bookings.filter(
        b => (b.departure_date || b.departureDate) === selectedDate
      );
      
      guestBookings = guestBookings.filter(
        b => (b.departure_date || b.departureDate) === selectedDate
      );
    }
    
    // Convert guest bookings to the same format as regular bookings
    const formattedGuestBookings = guestBookings.map(booking => ({
      ...booking,
      booking_type: 'guest',  // Add a marker to identify as guest booking
    }));
    
    // Combine regular and guest bookings
    return [...bookings, ...formattedGuestBookings];
  }, [selectedBusNo, allBookings, allGuestBookings, selectedDate, availableDates]);

  // Compute confirmed bookings
  const confirmedTableBookings = useMemo(() => {
    return filteredBookings.filter(
      b => String(b.status).toLowerCase() === 'confirmed'
    );
  }, [filteredBookings]);

  // Map bookings for display
  const mappedTableBookings = useMemo(() => {
    return confirmedTableBookings
      .map((booking, index) => ({
        id: booking.id,
        uniqueKey: `${booking.booking_type === 'guest' ? 'guest' : 'regular'}-${booking.id}-${index}`,
        serialNo: booking.serial_no || '-',
        name: booking.name || '-',
        busNumber: booking.bus_no || booking.busNumber || '-',
        price: booking.price || '-',
        bookedDate: booking.created_at || '-',
        phone: booking.phone_no || booking.phone || '-',
        ticketsReserved: booking.reserved_tickets || booking.ticketsReserved || 0,
        seatNumbers: Array.isArray(booking.seat_no) ? booking.seat_no.join(', ') : (booking.seat_no || '-'),
        route: booking.route || `${booking.pickup || ''}${booking.drop ? '-' + booking.drop : ''}` || '-',
        status: booking.status,
        bookingType: booking.booking_type === 'guest' ? 'Guest' : 'Regular'
      }))
      .sort((a, b) => {
        if (a.bookedDate === '-' && b.bookedDate === '-') return 0;
        if (a.bookedDate === '-') return 1;
        if (b.bookedDate === '-') return -1;
        return new Date(b.bookedDate) - new Date(a.bookedDate);
      });
  }, [confirmedTableBookings]);

  // Pagination logic for table rows
  const paginatedBookings = useMemo(() => {
    const startIdx = (currentPage - 1) * recordsPerPage;
    return mappedTableBookings.slice(startIdx, startIdx + recordsPerPage);
  }, [mappedTableBookings, currentPage, recordsPerPage]);

  const handleBusChange = (busNo) => {
    setSelectedBusNo(busNo);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Helper to check permission for Bus Booking Report
  const hasPermission = (action) => {
    if (!permissions || !permissions['Bus Booking Report']) return false;
    return !!permissions['Bus Booking Report'][action];
  };

  const handlePrint = () => {
    if (!hasPermission('print')) {
      setNotification("You don't have permission to print booking reports.");
      return;
    }
    if (!mappedTableBookings.length) return;
    if (!printTableRef.current) return;
    const printContents = printTableRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=800,width=1200');
    if (!printWindow) {
      setNotification('Popup blocked! Please allow popups for this site to print.');
      return;
    }
    printWindow.document.write('<html><head><title>Booking Report</title>');
    printWindow.document.write(`
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; margin: 0; padding: 24px; }
        .print-logo { display: block; margin: 0 auto 24px auto; max-width: 220px; }
        h1 { text-align: center; color: #1a237e; font-size: 2rem; margin-bottom: 12px; }
        .print-table { width: 100%; border-collapse: collapse; margin-top: 12px; background: #fff; box-shadow: 0 2px 8px #e3e3e3; }
        .print-table th, .print-table td { border: 1px solid #bdbdbd; padding: 10px 14px; font-size: 1rem; }
        .print-table th { background: #e3eafc; color: #1a237e; font-weight: 700; }
        .print-table tr:nth-child(even) { background: #f7fafd; }
        .print-table .print-hide, .print-table .print-hide * { display: none !important; }
        @media print {
          body { margin: 0; }
        }
      </style>
    `);
    printWindow.document.write('</head><body>');
    // Add logo and title using imported image path
    printWindow.document.write(`
      <img src="${require('../../../assets/Side.png')}" alt="Company Logo" class="print-logo" />
      <h1>Booking Report</h1>
    `);
    printWindow.document.write(printContents.replace(/ReportPrintLayout_print-header__[^\s"]*/g, 'print-logo-header').replace(/min-w-full/g, 'print-table'));
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const selectedBusObj = buses.find(bus => String(bus.bus_no) === String(selectedBusNo));

  return (
    <div className="flex flex-col flex-grow overflow-hidden bg-gray-50">
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow">
          {notification}
          <button className="ml-3 text-red-700 font-bold" onClick={() => setNotification("")}>×</button>
        </div>
      )}
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
              disabled={!mappedTableBookings.length || !hasPermission('print')}
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
              { label: 'Regular Bookings', value: mappedTableBookings.filter(b => b.bookingType === 'Regular').length },
              { label: 'Guest Bookings', value: mappedTableBookings.filter(b => b.bookingType === 'Guest').length },
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
                      Booked Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Phone
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
                    <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedBookings.map((booking) => (
                    <tr 
                      key={booking.uniqueKey} 
                      className={`hover:bg-gray-50 ${booking.bookingType === 'Guest' ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.serialNo}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.bookedDate && booking.bookedDate !== '-' ? new Date(booking.bookedDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {booking.phone}
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
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.bookingType === 'Guest' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                        }`}>
                          {booking.bookingType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            {/* Pagination Controls */}
            {mappedTableBookings.length > recordsPerPage && (
              <div className="flex justify-center my-4">
                <Pagination
                  page={currentPage}
                  setPage={setCurrentPage}
                  totalPages={Math.ceil(mappedTableBookings.length / recordsPerPage)}
                />
              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingReportPage;