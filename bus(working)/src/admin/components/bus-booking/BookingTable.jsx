import React from 'react';

const BookingTable = ({ bookings, frozenSeats, isLoading, selectedBusNo, selectedDate, printRef, buses }) => {
  // Helper: Map bus_id to bus_no
  const getBusNoById = (bus_id) => {
    const bus = buses?.find((b) => String(b.id) === String(bus_id));
    return bus?.bus_no || bus?.busNumber || 'N/A';
  };

  // Function to render status badge
  const renderStatusBadge = (status) => {
    let color;
    switch (status.toLowerCase()) {
      case 'confirmed':
        color = 'bg-green-100 text-green-800';
        break;
      case 'processing':
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'cancelled':
        color = 'bg-red-100 text-red-800';
        break;
      case 'frozen':
        color = 'bg-purple-100 text-purple-800';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{status}</span>;
  };

  // Function to render payment status badge
  const renderPaymentBadge = (status) => {
    if (!status) return <span className="text-xs text-gray-500">N/A</span>;
    
    let color;
    switch (status.toLowerCase()) {
      case 'paid':
        color = 'bg-green-100 text-green-800';
        break;
      case 'pending':
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'failed':
        color = 'bg-red-100 text-red-800';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{status}</span>;
  };

  // Prepare combined data of bookings and frozen seats
  const prepareTableData = () => {
    // Filter bookings and frozenSeats by bus_id and selectedDate
    const selectedBusObj = buses?.find((b) => String(b.bus_no) === String(selectedBusNo));
    const selectedBusId = selectedBusObj?.id;

    const filteredBookings = bookings.filter(
      b => String(b.bus_id) === String(selectedBusId) &&
           (!selectedDate || String(b.departure_date || b.departureDate) === String(selectedDate))
    );
    const filteredFrozenSeats = (frozenSeats || []).filter(
      f => String(f.bus_id) === String(selectedBusId) &&
           (!selectedDate || String(f.departure_date || f.departureDate) === String(selectedDate))
    );
    const bookingsData = filteredBookings.map(booking => ({
      id: booking.id,
      serialNo: booking.serial_no || '-',
      name: booking.name || booking.frozenBy || 'Admin',
      ticketsReserved: booking.reserved_tickets || booking.ticketsReserved || 0,
      seatNumbers: Array.isArray(booking.seat_no)
        ? booking.seat_no.map(s => String(s).trim()).filter(Boolean).sort((a, b) => Number(a) - Number(b)).join(', ')
        : (booking.seat_no || booking.seatNumbers || ''),
      paymentStatus: booking.payment_status || booking.paymentStatus || null,
      route: booking.route || `${booking.pickup || ''}${booking.drop ? '-' + booking.drop : ''}` || 'N/A',
      status: booking.status,
      reason: booking.reason,
      busNumber: getBusNoById(booking.bus_id),
      type: 'booking'
    }));
    const frozenData = filteredFrozenSeats.map(frozen => {
      const seatArr = Array.isArray(frozen.seat_no)
        ? frozen.seat_no.map(s => String(s).trim()).filter(Boolean)
        : (typeof frozen.seat_no === 'string' ? frozen.seat_no.split(',').map(s => s.trim()).filter(Boolean) : []);
      return {
        id: `frozen-${frozen.id}`,
        serialNo: frozen.serial_no || '-',
        name: frozen.name || frozen.frozenBy || 'Admin',
        ticketsReserved: seatArr.length,
        seatNumbers: seatArr.sort((a, b) => Number(a) - Number(b)).join(', '),
        paymentStatus: frozen.payment_status || null,
        route: frozen.route || `${frozen.start_point || ''}${frozen.end_point ? '-' + frozen.end_point : ''}` || 'N/A',
        status: 'Frozen',
        reason: frozen.reason,
        busNumber: getBusNoById(frozen.bus_id),
        type: 'frozen'
      };
    });
    return [...bookingsData, ...frozenData];
  };

  if (!selectedBusNo || !selectedDate) {
    return (
      <div className="p-4 text-center bg-white rounded-lg shadow">
        <p className="text-gray-500">Please select both a bus and date to view bookings.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center bg-white rounded-lg shadow">
        <p className="text-gray-500">Loading booking data...</p>
      </div>
    );
  }

  const tableData = prepareTableData();
  
  if (tableData.length === 0) {
    return (
      <div className="p-4 text-center bg-white rounded-lg shadow">
        <p className="text-gray-500">No bookings or frozen seats found for the selected criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="overflow-x-auto print-table" ref={printRef}>
        {/* This header will only show when printing */}
        <div className="print-header" style={{ display: 'none' }}>
          <h2>RS Express - Booking Report</h2>
          <p>Bus: {selectedBusNo ? (tableData[0]?.busNumber || 'N/A') : 'N/A'}</p>
          <p>Date: {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'N/A'}</p>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Serial No.
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Name/Agent
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Tickets
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Seat Numbers
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Payment
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Route
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Status
              </th>
              <th scope="col" className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row) => (
              <tr 
                key={row.id} 
                className={`hover:bg-gray-50 ${row.type === 'frozen' ? 'bg-purple-50' : ''}`}
              >
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {row.serialNo}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {row.name}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {row.ticketsReserved}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {row.seatNumbers}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {renderPaymentBadge(row.paymentStatus)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {row.route}
                </td>
                <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {renderStatusBadge(row.status)}
                </td>
                <td className="px-2 py-4 text-sm text-gray-900">
                  {row.reason && <span className="text-xs text-gray-500">{row.reason}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;