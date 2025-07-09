import React from 'react';

const SeatLegend = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
        <span className="text-sm">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-red-600 rounded"></div>
        <span className="text-sm">Reserved</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-blue-500 rounded"></div>
        <span className="text-sm">Guest Booking</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-green-600 rounded"></div>
        <span className="text-sm">Processing</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-purple-500 rounded"></div>
        <span className="text-sm">Frozen</span>
      </div>
      {/* Cancelled seats are not shown in the seat map */}
    </div>
  );
};

export default SeatLegend;