import React from 'react';
import { RiSteering2Fill } from "react-icons/ri";

const BusSeatLayout = ({ seatStatus, isLoading }) => {
  const getSeatColor = (status) => {
    switch (status) {
      case 'reserved':
        return 'bg-red-500';
      case 'guest':
        return 'bg-blue-500';  // Guest booking color
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

  const getSeatTextColor = (status) => {
    // For darker backgrounds, use white text
    if (['reserved', 'processing', 'freezed', 'guest'].includes(status)) {
      return 'text-white';
    }
    // For lighter backgrounds, use dark text
    return 'text-gray-700';
  };

  // Render a single seat
  const renderSeat = (seatNumber) => {
    // Make sure seatNumber is a number for lookup
    const numSeat = Number(seatNumber);
    const status = seatStatus[numSeat] || 'available';
    const bgClass = getSeatColor(status);
    const textClass = getSeatTextColor(status);
    
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

  // Dynamically render rows based on totalSeats
  const renderDynamicRows = () => {
    const rows = [];
    const totalSeats = Object.keys(seatStatus).length;
    
    // If we have 0 seats, return early with a message
    if (totalSeats === 0) {
      return <div className="text-center text-red-500">No seat data available</div>;
    }
    
    // Standard 2+2 layout for most buses
    if (totalSeats > 0) {
      let seatNum = 1;
      
      // Front row (usually 2 seats for driver and conductor)
      if (totalSeats <= 32) {
        rows.push(
          <div key="front-row" className="flex justify-center mb-3">
            <div className="w-14 h-14 md:w-16 md:h-16 m-1"></div>
            {renderSeat(1)}
            <div className="w-10"></div> {/* aisle */}
            {renderSeat(2)}
            <div className="w-14 h-14 md:w-16 md:h-16 m-1"></div>
          </div>
        );
        seatNum = 3; // Start from seat 3
      }
      
      // Main rows (4 seats per row: 2 on each side of aisle)
      while (seatNum <= totalSeats) {
        const rowSeats = [];
        
        // Determine the seats for this row
        let seatsInRow;
        
        // Special handling for seats after 40 - group them to avoid single seats
        if (seatNum > 40) {
          // For seats after 40, try to group remaining seats optimally
          const remainingSeats = totalSeats - seatNum + 1;
          
          if (remainingSeats === 5) {
            // If we have exactly 5 seats left, put all 5 in one row
            seatsInRow = [seatNum, seatNum + 1, seatNum + 2, seatNum + 3, seatNum + 4].filter(s => s <= totalSeats);
          } else if (remainingSeats <= 4) {
            // If 4 or fewer seats left, put them all in one row
            seatsInRow = [];
            for (let i = 0; i < remainingSeats && seatNum + i <= totalSeats; i++) {
              seatsInRow.push(seatNum + i);
            }
          } else {
            // Normal grouping of 4
            seatsInRow = [seatNum, seatNum + 1, seatNum + 2, seatNum + 3].filter(s => s <= totalSeats);
          }
          
          // For seats > 40, always display in reverse order
          const reversedSeats = [...seatsInRow].reverse();
          
          // Handle different row sizes for seats after 40
          if (seatsInRow.length === 5) {
            // 5 seats: 3 on left, aisle, 2 on right
            rowSeats.push(renderSeat(reversedSeats[0]));
            rowSeats.push(renderSeat(reversedSeats[1]));
            rowSeats.push(renderSeat(reversedSeats[2]));
            rowSeats.push(<div key={`aisle-${seatNum}`} className="w-10"></div>);
            rowSeats.push(renderSeat(reversedSeats[3]));
            rowSeats.push(renderSeat(reversedSeats[4]));
          } else {
            // Standard 2+2 layout
            if (reversedSeats[0]) rowSeats.push(renderSeat(reversedSeats[0]));
            if (reversedSeats[1]) rowSeats.push(renderSeat(reversedSeats[1]));
            rowSeats.push(<div key={`aisle-${seatNum}`} className="w-10"></div>);
            if (reversedSeats[2]) rowSeats.push(renderSeat(reversedSeats[2]));
            if (reversedSeats[3]) rowSeats.push(renderSeat(reversedSeats[3]));
          }
          
          seatNum += seatsInRow.length; // Advance by the number of seats we just processed
        } else {
          // For seats <= 40, use normal order and standard 4-seat grouping
          seatsInRow = [seatNum, seatNum + 1, seatNum + 2, seatNum + 3].filter(s => s <= totalSeats);
          
          // Left side
          if (seatsInRow[0]) rowSeats.push(renderSeat(seatsInRow[0]));
          if (seatsInRow[1]) rowSeats.push(renderSeat(seatsInRow[1]));
          
          // Aisle
          rowSeats.push(<div key={`aisle-${seatNum}`} className="w-10"></div>);
          
          // Right side
          if (seatsInRow[2]) rowSeats.push(renderSeat(seatsInRow[2]));
          if (seatsInRow[3]) rowSeats.push(renderSeat(seatsInRow[3]));
          
          seatNum += 4; // Always advance by 4 for normal seats
        }
        
        rows.push(
          <div key={`row-${seatNum}`} className="flex justify-center mb-1">
            {rowSeats}
          </div>
        );
      }
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