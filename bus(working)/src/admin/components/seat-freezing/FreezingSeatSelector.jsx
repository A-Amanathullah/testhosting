import React from 'react';
import { RiSteering2Fill } from "react-icons/ri";

const FreezingSeatSelector = ({ seatStatus, selectedSeats, onSeatSelect, isLoading, disabled, totalSeats = 44 }) => {
  // Helper function to determine seat class based on status
  const getSeatClass = (seatNumber) => {
    const status = seatStatus[seatNumber] || 'available';
    const isSelected = selectedSeats.includes(seatNumber);
    
    if (isSelected) {
      return 'bg-blue-500 text-white';
    }
    
    switch (status) {
      case 'reserved':
        return 'bg-red-600 text-white cursor-not-allowed';
      case 'freezed':
        // Change cursor style for frozen seats to be clickable
        return 'bg-purple-500 text-white cursor-pointer';
      case 'processing':
        return 'bg-green-600 text-white cursor-not-allowed';
      default:
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer';
    }
  };

  // Modified: Handle seat click - allow selecting both available and freezed seats
  const handleSeatClick = (seatNumber) => {
    const status = seatStatus[seatNumber] || 'available';
    // Allow both available and freezed seats to be selected
    if ((status === 'available' || status === 'freezed') && !disabled) {
      onSeatSelect(seatNumber);
    }
  };
  
  // Render a single seat
  const renderSeat = (seatNumber) => {
    const status = seatStatus[Number(seatNumber)] || "available";
    // Modified: seats are selectable if they're available OR freezed
    const isSelectable = status === 'available' || status === 'freezed';
    const seatClass = getSeatClass(seatNumber);
    
    return (
      <div
        key={seatNumber}
        className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-lg font-medium rounded-md m-1 ${seatClass}`}
        title={`Seat ${seatNumber}: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
        onClick={() => handleSeatClick(seatNumber)}
        role={isSelectable ? "button" : ""}
        aria-disabled={!isSelectable}
      >
        {seatNumber}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow">Loading seat data...</div>;
  }

  if (disabled) {
    return <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow">Select a bus and date to view seat layout</div>;
  }

  // Dynamically render rows based on totalSeats
  const renderDynamicRows = () => {
    const rows = [];
    let seatNum = 1;
    // Render main rows (1-40)
    while (seatNum <= Math.min(40, totalSeats)) {
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
    <div className="p-4 bg-white rounded-lg shadow">
      {/* Updated title to reflect functionality */}
      <h3 className="mb-4 text-lg font-medium">Select Seats to Freeze or Unfreeze</h3>
      
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
      
      {/* Selection info */}
      <div className="p-3 mt-4 rounded-md bg-gray-50">
        <p className="text-sm text-gray-600">
          {selectedSeats.length === 0 ? (
            'Click on available seats to freeze them or frozen seats to unfreeze them.'
          ) : (
            <>Selected seats: <span className="font-medium">{selectedSeats.sort((a, b) => a - b).join(', ')}</span></>
          )}
        </p>
      </div>
      
      {/* Legend */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-purple-500 rounded"></div>
            <span className="text-sm">Frozen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-500 rounded"></div>
            <span className="text-sm">Agent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-600 rounded"></div>
            <span className="text-sm">Reserved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreezingSeatSelector;