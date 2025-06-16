import React from 'react';
import { RiSteering2Fill } from "react-icons/ri";

const BusSeatLayout = ({ seatStatus, isLoading }) => {
  const getSeatColor = (status) => {
    switch (status) {
      case 'reserved':
        return 'bg-red-500';
      case 'processing':
        return 'bg-green-600'; // Processing is green
      case 'freezed':
        return 'bg-purple-500';
      case 'cancelled':
        return 'bg-gray-400';
      default:
        return 'bg-gray-200'; // available seats should be gray
    }
  };

  // Render a single seat
  const renderSeat = (seatNumber) => {
    // Make sure seatNumber is a number for lookup
    const status = seatStatus[Number(seatNumber)] || 'available';
    const bgClass = getSeatColor(status);
    const textClass = (status === 'reserved' || status === 'processing' || status === 'freezed' || status === 'cancelled')
      ? 'text-white'
      : 'text-gray-700';
    return (
      <div
        key={seatNumber}
        className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-lg font-medium rounded-md m-1 ${bgClass} ${textClass}`}
        title={`Seat ${seatNumber}: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
      >
        {seatNumber}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading seat data...</div>;
  }

  // Check if there is any seat data
  const hasSeatData = Object.keys(seatStatus).length > 0;

  if (!hasSeatData) {
    return <div className="p-4 text-center text-gray-500">Select a bus and date to view seat layout</div>;
  }

  // Dynamically render rows based on totalSeats (like FreezingSeatSelector)
  const renderDynamicRows = () => {
    const rows = [];
    let seatNum = 1;
    // Render main rows (1-40)
    while (seatNum <= Math.min(40, Object.keys(seatStatus).length)) {
      rows.push(
        <div key={`row-${seatNum}`} className="flex justify-center mb-1">
          {renderSeat(seatNum)}
          {renderSeat(seatNum + 1)}
          <div className="w-10"></div> {/* aisle */}
          {renderSeat(seatNum + 2)}
          {renderSeat(seatNum + 3)}
        </div>
      );
      seatNum += 4;
    }
    // All seats after 40 in one row, in reverse order
    const totalSeats = Object.keys(seatStatus).length;
    if (totalSeats > 40) {
      const lastRowSeats = [];
      for (let i = totalSeats; i > 40; i--) {
        lastRowSeats.push(i);
      }
      rows.push(
        <div key="last-row" className="flex justify-center mt-2">
          {lastRowSeats.map(renderSeat)}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      {/* Driver section with icon */}
      <div className="flex items-center justify-between px-4 mb-4">
        <span className="text-sm text-gray-500">Front</span>
        <span className="flex items-center gap-1 font-medium text-gray-600">
          Driver <RiSteering2Fill className="text-3xl" />
        </span>
      </div>
      {/* Seats layout */}
      <div className="bus-layout">
        {renderDynamicRows()}
      </div>
    </div>
  );
};

export default BusSeatLayout;