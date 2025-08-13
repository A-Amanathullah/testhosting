import React, { useState, useEffect, useRef } from 'react';
import { usePermissions } from '../../../context/PermissionsContext';
import { 
  BusSelector, 
  DateSelector,
  PrintButton,
  ReportPrintLayout
} from '../../components/bus-booking';
import '../../components/bus-booking/print.css';
import useBusHook from '../../../hooks/useBusHook';
import useAdminCancellations from '../../../admin/hooks/useCancellations';

const CancellationReportPage = () => {
  // State for selected filters and data
  const [selectedBusNo, setSelectedBusNo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [notification, setNotification] = useState("");
  // Reference to the table for printing
  const printTableRef = useRef(null);

  // Fetch buses using hook
  const { buses, loading: busesLoading } = useBusHook();
  const { cancellations, loading: cancellationsLoading } = useAdminCancellations();
  const { permissions } = usePermissions();

  const isLoading = busesLoading || cancellationsLoading;

  // Only show buses that have cancellations
  const cancelledBusNos = Array.from(new Set((cancellations || []).map(c => String(c.bus_no)))).filter(Boolean);
  const cancelledBuses = buses.filter(bus => cancelledBusNos.includes(String(bus.bus_no)));

  // Filter cancellations by selected bus and date
  let filteredCancellations = cancellations || [];
  if (selectedBusNo) {
    filteredCancellations = filteredCancellations.filter(c => String(c.bus_no) === String(selectedBusNo));
  }
  if (selectedDate) {
    filteredCancellations = filteredCancellations.filter(c => String(c.departure_date) === String(selectedDate));
  }

  // Generate available dates from cancellations (filtered by bus if selected)
  useEffect(() => {
    let dates = cancellations ? cancellations.map(c => c.departure_date).filter(Boolean) : [];
    if (selectedBusNo) {
      dates = cancellations
        ? cancellations.filter(c => String(c.bus_no) === String(selectedBusNo)).map(c => c.departure_date).filter(Boolean)
        : [];
    }
    const uniqueDates = Array.from(new Set(dates)).sort();
    setAvailableDates(uniqueDates);
  }, [selectedBusNo, cancellations]);

  // Map for table
  const mappedTableBookings = (filteredCancellations || [])
    .map(booking => ({
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
    }))
    .sort((a, b) => {
      if (!a.cancellationDate && !b.cancellationDate) return 0;
      if (!a.cancellationDate) return 1;
      if (!b.cancellationDate) return -1;
      return new Date(b.cancellationDate) - new Date(a.cancellationDate);
    });

  // Handle bus selection
  const handleBusChange = (busNo) => {
    setSelectedBusNo(busNo);
  };

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Helper to check permission for Cancellation Report
  const hasPermission = (action) => {
    if (!permissions || !permissions['Cancellation Report']) return false;
    return !!permissions['Cancellation Report'][action];
  };

  // Handle print action
  const handlePrint = () => {
    if (!hasPermission('print')) {
      setNotification("You don't have permission to print cancellation reports.");
      return;
    }
    
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
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow">
          {notification}
          <button className="ml-3 text-red-700 font-bold" onClick={() => setNotification("")}>×</button>
        </div>
      )}
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
              buses={cancelledBuses} 
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