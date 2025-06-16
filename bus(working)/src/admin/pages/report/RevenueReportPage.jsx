import React, { useState, useEffect, useRef } from 'react';
import { PrintButton, ReportPrintLayout } from '../../components/bus-booking';
import useBusHook from '../../../hooks/useBusHook';
import useBookings from '../../../hooks/useBookings';
import '../../components/bus-booking/print.css';

const RevenueReportPage = () => {
  // Filters
  const [selectedBusNo, setSelectedBusNo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const printReportRef = useRef(null);

  // Data
  const { buses, loading: busesLoading } = useBusHook();
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

  // Only show confirmed bookings
  const confirmedBookings = filteredBookings.filter(
    b => String(b.status).toLowerCase() === 'confirmed'
  );
  // Only show cancelled bookings
  const cancelledBookings = filteredBookings.filter(
    b => String(b.status).toLowerCase() === 'cancelled'
  );

  // Map for table
  const mappedTableBookings = confirmedBookings.map(booking => ({
    id: booking.id,
    date: booking.departure_date || booking.departureDate || '-',
    serialNo: booking.serial_no || '-',
    name: booking.name || '-',
    busNumber: booking.bus_no || booking.busNumber || '-',
    price: booking.price || 0,
    ticketsReserved: booking.reserved_tickets || booking.ticketsReserved || 0,
    seatNumbers: Array.isArray(booking.seat_no) ? booking.seat_no.join(', ') : (booking.seat_no || '-'),
    route: booking.route || `${booking.pickup || ''}${booking.drop ? '-' + booking.drop : ''}` || '-',
  }));

  // Map for cancelations
  const mappedCancelBookings = cancelledBookings.map(booking => ({
    id: booking.id,
    price: booking.price || 0,
    ticketsReserved: booking.reserved_tickets || booking.ticketsReserved || 0,
  }));

  // Summary
  const totalRevenue = mappedTableBookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
  const totalBookings = mappedTableBookings.length;
  const totalSeats = mappedTableBookings.reduce((sum, b) => sum + Number(b.ticketsReserved || 0), 0);
  const totalCancelations = mappedCancelBookings.length;
  const totalCancelRevenue = mappedCancelBookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
  const totalProfit = totalRevenue - totalCancelRevenue;

  // Print
  const handlePrint = () => {
    if (mappedTableBookings.length) {
      if (printReportRef.current) {
        printReportRef.current.focus();
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
          <h1 className="text-2xl font-bold text-gray-800">Revenue Report</h1>
          <p className="text-sm text-gray-500">Summary of revenue from confirmed bookings.</p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="block text-sm font-medium text-gray-700">Bus</label>
            <select
              value={selectedBusNo}
              onChange={e => setSelectedBusNo(e.target.value)}
              className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Buses</option>
              {buses.map(bus => (
                <option key={bus.id} value={bus.bus_no}>{bus.bus_no}</option>
              ))}
            </select>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <select
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Dates</option>
              {availableDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>
          <div className="ml-auto">
            <PrintButton 
              onClick={handlePrint}
              disabled={!mappedTableBookings.length}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 text-white bg-red-600 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{'Rs ' + totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 text-white bg-green-600 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="flex-1 ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">Total Profit</p>
                <p className="text-2xl font-semibold text-gray-900">{'Rs ' + totalProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 text-white bg-blue-600 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1 ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{totalBookings}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 text-white bg-yellow-600 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">Total Cancelations</p>
                <p className="text-2xl font-semibold text-gray-900">{totalCancelations}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 text-white bg-purple-600 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">Total Seats</p>
                <p className="text-2xl font-semibold text-gray-900">{totalSeats}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Report Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow" ref={printReportRef}>
          <ReportPrintLayout
            title="Revenue Report"
            dateInfo={`Date: ${selectedDate ? new Date(selectedDate).toLocaleDateString() : 'All Dates'}`}
            additionalInfo={[
              `Bus: ${selectedBusNo ? selectedBusObj?.bus_no || 'N/A' : 'All Buses'}`
            ]}
            summaryData={[
              { label: 'Total Revenue', value: 'Rs ' + totalRevenue.toLocaleString() },
              { label: 'Total Bookings', value: totalBookings },
              { label: 'Total Seats', value: totalSeats }
            ]}
          />
          {isLoading ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Loading revenue data...</p>
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
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Serial No.</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Bus No.</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Route</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tickets</th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Seats</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mappedTableBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{booking.date}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{booking.serialNo}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{booking.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{booking.busNumber}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{booking.route}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{'Rs ' + Number(booking.price).toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{booking.ticketsReserved}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{booking.seatNumbers}</td>
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

export default RevenueReportPage;