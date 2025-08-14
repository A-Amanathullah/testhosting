import React, { useState, useMemo } from 'react';
import Pagination from '../../components/Pagination';
import { normalizeToYYYYMMDD } from '../../../utils/dateUtils';

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

const BookingTable = ({ bookings, frozenSeats, cancellations = [], guestBookings = [], isLoading, selectedBusNo, selectedDate, printRef, buses, onCancelBooking }) => {
  // Helper: Map bus_id to bus_no
  // const getBusNoById = (bus_id) => {
  //   const bus = buses?.find((b) => String(b.id) === String(bus_id));
  //   return bus?.bus_no || bus?.busNumber || 'N/A';
  // };

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

  // Function to render action buttons based on booking status
  const renderActions = (row) => {
    // Show cancel button for confirmed regular bookings and guest bookings
    if ((row.type === 'booking' || row.type === 'guest') && row.status.toLowerCase() === 'confirmed') {
      return (
        <button
          onClick={() => onCancelBooking && onCancelBooking(row)}
          className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
        >
          Cancel
        </button>
      );
    }
    return null;
  };

  // Prepare combined data of bookings, frozen seats, and cancellations
  // For phone number: regular bookings use booking.phone_no, guest/cancellation use booking.phone
  // const prepareTableData = () => {
  //   // Filter bookings and frozenSeats by bus_id and selectedDate
  //   const selectedBusObj = buses?.find((b) => String(b.bus_no) === String(selectedBusNo));
  //   const selectedBusId = selectedBusObj?.id;
    
  //   // Normalize selected date for comparison
  //   const normalizedSelectedDate = normalizeToYYYYMMDD(selectedDate);
    
  //   // Filter regular bookings
  //   const filteredBookings = bookings.filter(b => {
  //     const normalizedBookingDate = normalizeToYYYYMMDD(b.departure_date || b.departureDate);
  //     const busMatches = String(b.bus_id) === String(selectedBusId) || 
  //                        String(b.bus_no) === String(selectedBusNo);
  //     const dateMatches = !normalizedSelectedDate || normalizedBookingDate === normalizedSelectedDate;
  //     return busMatches && dateMatches;
  //   });
    
  //   // Filter frozen seats
  //   const filteredFrozenSeats = (frozenSeats || []).filter(f => {
  //     const normalizedFrozenDate = normalizeToYYYYMMDD(f.departure_date || f.departureDate);
  //     const busMatches = String(f.bus_id) === String(selectedBusId) || 
  //                        String(f.bus_no) === String(selectedBusNo);
  //     const dateMatches = !normalizedSelectedDate || normalizedFrozenDate === normalizedSelectedDate;
  //     return busMatches && dateMatches;
  //   });
    
  //   // Filter cancellations - be more flexible with bus ID matching
  //   const filteredCancellations = (cancellations || []).filter(c => {
  //     const normalizedCancelDate = normalizeToYYYYMMDD(c.departure_date);
  //     const busMatches = String(c.bus_id) === String(selectedBusId) || 
  //                        String(c.bus_no) === String(selectedBusNo);
  //     const dateMatches = !normalizedSelectedDate || normalizedCancelDate === normalizedSelectedDate;
  //     return busMatches && dateMatches;
  //   });
    
  //   // Filter guest bookings
  //   const filteredGuestBookings = (guestBookings || []).filter(g => {
  //     if (!g) return false;
      
  //     let normalizedGuestDate;
  //     try {
  //       normalizedGuestDate = normalizeToYYYYMMDD(g.departure_date);
  //     } catch (err) {
  //       normalizedGuestDate = null;
  //     }
      
  //     const busMatches = 
  //       String(g.bus_no) === String(selectedBusNo) || 
  //       String(g.bus_id) === String(selectedBusId);
      
  //     const dateMatches = 
  //       !normalizedSelectedDate || 
  //       !normalizedGuestDate ||
  //       normalizedGuestDate === normalizedSelectedDate;
      
  //     return busMatches && dateMatches;
  //   });
    
  //   const bookingsData = filteredBookings.map(booking => {
  //     const parsedSeats = parseSeatNumbers(booking.seat_no);
  //     const formattedSeatNumbers = parsedSeats.sort((a, b) => a - b).join(', ');
      
  //     return {
  //       id: booking.id,
  //       serialNo: booking.serial_no || '-',
  //       name: booking.name || booking.frozenBy || 'Admin',
  //       phone: booking.phone_no || '',
  //       ticketsReserved: booking.reserved_tickets || booking.ticketsReserved || parsedSeats.length || 0,
  //       seatNumbers: formattedSeatNumbers,
  //       paymentStatus: booking.payment_status || booking.paymentStatus || null,
  //       route: booking.route || `${booking.pickup || ''}${booking.drop ? '-' + booking.drop : ''}` || 'N/A',
  //       status: booking.status,
  //       reason: booking.reason,
  //       busNumber: getBusNoById(booking.bus_id),
  //       role: booking.role,
  //       type: 'booking',
  //       raw: booking // Keep the raw booking data for the cancel action
  //     };
  //   });
    
  //   const frozenData = filteredFrozenSeats.map(frozen => {
  //     const parsedSeats = parseSeatNumbers(frozen.seat_no);
  //     const formattedSeatNumbers = parsedSeats.sort((a, b) => a - b).join(', ');
      
  //     return {
  //       id: `frozen-${frozen.id}`,
  //       serialNo: frozen.serial_no || '-',
  //       name: frozen.name || frozen.frozenBy || 'Admin',
  //       ticketsReserved: parsedSeats.length,
  //       seatNumbers: formattedSeatNumbers,
  //       paymentStatus: frozen.payment_status || null,
  //       route: frozen.route || `${frozen.start_point || ''}${frozen.end_point ? '-' + frozen.end_point : ''}` || 'N/A',
  //       status: 'Frozen',
  //       reason: frozen.reason,
  //       busNumber: getBusNoById(frozen.bus_id),
  //       role: frozen.role,
  //       type: 'frozen'
  //     };
  //   });
    
  //   const cancellationData = filteredCancellations.map(c => {
  //     const parsedSeats = parseSeatNumbers(c.seat_no);
  //     const formattedSeatNumbers = parsedSeats.sort((a, b) => a - b).join(', ');
      
  //     return {
  //       id: `cancelled-${c.id}`,
  //       serialNo: c.serial_no || '-',
  //       name: c.name || 'Passenger',
  //       phone: c.phone || '',
  //       ticketsReserved: parsedSeats.length,
  //       seatNumbers: formattedSeatNumbers,
  //       paymentStatus: c.payment_status || null,
  //       route: c.route || `${c.pickup || ''}${c.drop ? '-' + c.drop : ''}` || 'N/A',
  //       status: 'Cancelled',
  //       reason: c.reason,
  //       busNumber: getBusNoById(c.bus_id),
  //       role: c.role,
  //       type: 'cancelled'
  //     };
  //   });
    
  //   // Add guest bookings to the data
  //   const guestData = filteredGuestBookings.map(guest => {
  //     if (!guest) {
  //       return null;
  //     }
      
  //     const parsedSeats = parseSeatNumbers(guest.seat_no);
  //     const formattedSeatNumbers = parsedSeats.sort((a, b) => a - b).join(', ');
      
  //     const tableData = {
  //       id: `guest-${guest.id || 'unknown'}`,
  //       serialNo: guest.serial_no || '-',
  //       name: guest.name || 'Guest',
  //       phone: guest.phone || '',
  //       ticketsReserved: guest.reserved_tickets || parsedSeats.length,
  //       seatNumbers: formattedSeatNumbers,
  //       paymentStatus: guest.payment_status || null,
  //       route: guest.route || `${guest.pickup || ''}${guest.drop ? '-' + guest.drop : ''}` || 'N/A',
  //       status: guest.status || 'Confirmed',  // Default to Confirmed if no status is provided
  //       reason: guest.reason,
  //       busNumber: guest.bus_no || getBusNoById(guest.bus_id),
  //       type: 'guest',
  //       raw: guest // Keep the raw booking data for the cancel action
  //     };
      
  //     return tableData;
  //   }).filter(Boolean); // Filter out any null entries from invalid data
    
  //   return [...bookingsData, ...frozenData, ...cancellationData, ...guestData];
  // };


  // Pagination state (must be before any early returns)
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  // Always compute tableData and paginatedTableData, but render early returns below
  const tableData = useMemo(() => {
    // Prepare combined data of bookings, frozen seats, and cancellations
    // For phone number: regular bookings use booking.phone_no, guest/cancellation use booking.phone
    const getBusNoById = (bus_id) => {
      const bus = buses?.find((b) => String(b.id) === String(bus_id));
      return bus?.bus_no || bus?.busNumber || 'N/A';
    };
    const selectedBusObj = buses?.find((b) => String(b.bus_no) === String(selectedBusNo));
    const selectedBusId = selectedBusObj?.id;
    const normalizedSelectedDate = normalizeToYYYYMMDD(selectedDate);
    const filteredBookings = bookings.filter(b => {
      const normalizedBookingDate = normalizeToYYYYMMDD(b.departure_date || b.departureDate);
      const busMatches = String(b.bus_id) === String(selectedBusId) || 
                         String(b.bus_no) === String(selectedBusNo);
      const dateMatches = !normalizedSelectedDate || normalizedBookingDate === normalizedSelectedDate;
      return busMatches && dateMatches;
    });
    const filteredFrozenSeats = (frozenSeats || []).filter(f => {
      const normalizedFrozenDate = normalizeToYYYYMMDD(f.departure_date || f.departureDate);
      const busMatches = String(f.bus_id) === String(selectedBusId) || 
                         String(f.bus_no) === String(selectedBusNo);
      const dateMatches = !normalizedSelectedDate || normalizedFrozenDate === normalizedSelectedDate;
      return busMatches && dateMatches;
    });
    const filteredCancellations = (cancellations || []).filter(c => {
      const normalizedCancelDate = normalizeToYYYYMMDD(c.departure_date);
      const busMatches = String(c.bus_id) === String(selectedBusId) || 
                         String(c.bus_no) === String(selectedBusNo);
      const dateMatches = !normalizedSelectedDate || normalizedCancelDate === normalizedSelectedDate;
      return busMatches && dateMatches;
    });
    const filteredGuestBookings = (guestBookings || []).filter(g => {
      if (!g) return false;
      let normalizedGuestDate;
      try {
        normalizedGuestDate = normalizeToYYYYMMDD(g.departure_date);
      } catch (err) {
        normalizedGuestDate = null;
      }
      const busMatches = 
        String(g.bus_no) === String(selectedBusNo) || 
        String(g.bus_id) === String(selectedBusId);
      const dateMatches = 
        !normalizedSelectedDate || 
        !normalizedGuestDate ||
        normalizedGuestDate === normalizedSelectedDate;
      return busMatches && dateMatches;
    });
    const bookingsData = filteredBookings.map(booking => {
      const parsedSeats = parseSeatNumbers(booking.seat_no);
      const formattedSeatNumbers = parsedSeats.sort((a, b) => a - b).join(', ');
      return {
        id: booking.id,
        serialNo: booking.serial_no || '-',
        name: booking.name || booking.frozenBy || 'Admin',
        phone: booking.phone_no || '',
        ticketsReserved: booking.reserved_tickets || booking.ticketsReserved || parsedSeats.length || 0,
        seatNumbers: formattedSeatNumbers,
        paymentStatus: booking.payment_status || booking.paymentStatus || null,
        route: booking.route || `${booking.pickup || ''}${booking.drop ? '-' + booking.drop : ''}` || 'N/A',
        status: booking.status,
        reason: booking.reason,
        busNumber: getBusNoById(booking.bus_id),
        role: booking.role,
        type: 'booking',
        raw: booking // Keep the raw booking data for the cancel action
      };
    });
    const frozenData = filteredFrozenSeats.map(frozen => {
      const parsedSeats = parseSeatNumbers(frozen.seat_no);
      const formattedSeatNumbers = parsedSeats.sort((a, b) => a - b).join(', ');
      return {
        id: `frozen-${frozen.id}`,
        serialNo: frozen.serial_no || '-',
        name: frozen.name || frozen.frozenBy || 'Admin',
        ticketsReserved: parsedSeats.length,
        seatNumbers: formattedSeatNumbers,
        paymentStatus: frozen.payment_status || null,
        route: frozen.route || `${frozen.start_point || ''}${frozen.end_point ? '-' + frozen.end_point : ''}` || 'N/A',
        status: 'Frozen',
        reason: frozen.reason,
        busNumber: getBusNoById(frozen.bus_id),
        role: frozen.role,
        type: 'frozen'
      };
    });
    const cancellationData = filteredCancellations.map(c => {
      const parsedSeats = parseSeatNumbers(c.seat_no);
      const formattedSeatNumbers = parsedSeats.sort((a, b) => a - b).join(', ');
      return {
        id: `cancelled-${c.id}`,
        serialNo: c.serial_no || '-',
        name: c.name || 'Passenger',
        phone: c.phone || '',
        ticketsReserved: parsedSeats.length,
        seatNumbers: formattedSeatNumbers,
        paymentStatus: c.payment_status || null,
        route: c.route || `${c.pickup || ''}${c.drop ? '-' + c.drop : ''}` || 'N/A',
        status: 'Cancelled',
        reason: c.reason,
        busNumber: getBusNoById(c.bus_id),
        role: c.role,
        type: 'cancelled'
      };
    });
    const guestData = filteredGuestBookings.map(guest => {
      if (!guest) {
        return null;
      }
      const parsedSeats = parseSeatNumbers(guest.seat_no);
      const formattedSeatNumbers = parsedSeats.sort((a, b) => a - b).join(', ');
      const tableData = {
        id: `guest-${guest.id || 'unknown'}`,
        serialNo: guest.serial_no || '-',
        name: guest.name || 'Guest',
        phone: guest.phone || '',
        ticketsReserved: guest.reserved_tickets || parsedSeats.length,
        seatNumbers: formattedSeatNumbers,
        paymentStatus: guest.payment_status || null,
        route: guest.route || `${guest.pickup || ''}${guest.drop ? '-' + guest.drop : ''}` || 'N/A',
        status: guest.status || 'Confirmed',  // Default to Confirmed if no status is provided
        reason: guest.reason,
        busNumber: guest.bus_no || getBusNoById(guest.bus_id),
        type: 'guest',
        raw: guest // Keep the raw booking data for the cancel action
      };
      return tableData;
    }).filter(Boolean); // Filter out any null entries from invalid data
    const allRows = [...bookingsData, ...frozenData, ...cancellationData, ...guestData];
    // Try to sort by id descending (assuming id is numeric or string with numeric value)
    return allRows.slice().sort((a, b) => {
      const aId = parseInt((a.raw?.id ?? a.id ?? '').toString().replace(/\D/g, ''));
      const bId = parseInt((b.raw?.id ?? b.id ?? '').toString().replace(/\D/g, ''));
      if (!isNaN(aId) && !isNaN(bId)) return bId - aId;
      return 0;
    });
  }, [bookings, frozenSeats, cancellations, guestBookings, selectedBusNo, selectedDate, buses]);

  const paginatedTableData = useMemo(() => (
    tableData.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
  ), [tableData, currentPage, recordsPerPage]);

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
                Phone
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Type
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
              <th scope="col" className="px-2 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTableData.map((row) => (
              <tr 
                key={row.id} 
                className={`hover:bg-gray-50 ${row.type === 'frozen' ? 'bg-purple-50' : row.type === 'guest' ? 'bg-blue-50' : ''}`}
              >
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {row.serialNo}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {row.name}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {row.phone}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {row.type === 'guest' ? 'Guest' : row.type === 'booking' ? `${row.role}` : row.type === 'frozen' ? 'Frozen' : 'Cancelled'}
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
                <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {renderActions(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        {tableData.length > recordsPerPage && (
          <div className="flex justify-center my-4">
            <Pagination
              page={currentPage}
              setPage={setCurrentPage}
              totalPages={Math.ceil(tableData.length / recordsPerPage)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingTable;