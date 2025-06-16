import React from 'react';
import { format } from 'date-fns';

const FreezingTable = ({ frozenSeats, isLoading, busId, date, buses }) => {
  // Helper: Map bus_id to bus_no

  // Filter and prepare frozen seat data for the selected bus and date
  const selectedFrozenSeats = (frozenSeats || []).filter(f => {
    const seatBusId = f.bus_id || f.busId || f.bus_no || f.busNo;
    const seatDate = f.departure_date || f.date || f.departureDate;
    return String(seatBusId) === String(busId) && String(seatDate) === String(date);
  }).map(frozen => {
    const seatArr = Array.isArray(frozen.seat_no)
      ? frozen.seat_no.map(s => String(s).trim()).filter(Boolean)
      : (typeof frozen.seat_no === 'string' ? frozen.seat_no.split(',').map(s => s.trim()).filter(Boolean) : []);
    return {
      id: frozen.id,
      serialNo: frozen.serial_no || '-',
      name: frozen.name || frozen.frozenBy || 'Admin',
      ticketsReserved: seatArr.length,
      seatNumbers: seatArr.sort((a, b) => Number(a) - Number(b)).join(', '),
      reason: frozen.reason || '',
      frozenAt: frozen.frozenAt || frozen.created_at || frozen.createdAt || frozen.timestamp,
    };
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="mb-4 text-lg font-medium">Frozen Seats</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Serial No.</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name/Agent</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tickets</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Seat Numbers</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Reason</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Frozen At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-sm text-center text-gray-500">Loading...</td>
              </tr>
            ) : selectedFrozenSeats.length > 0 ? (
              selectedFrozenSeats.map(row => (
                <tr key={row.id}>
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{row.serialNo}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{row.ticketsReserved}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{row.seatNumbers}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{row.reason || <span className="italic text-gray-400">N/A</span>}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {row.frozenAt ? (() => {
                      const dateObj = new Date(row.frozenAt);
                      return isNaN(dateObj.getTime()) ? <span className="italic text-gray-400">Invalid</span> : format(dateObj, 'PPp');
                    })() : <span className="italic text-gray-400">N/A</span>}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-sm text-center text-gray-500">
                  {busId && date ? 'No frozen seats found for this bus and date.' : 'Please select a bus and date to view frozen seats.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FreezingTable;