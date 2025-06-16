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
        <div className="w-5 h-5 bg-green-600 rounded"></div>
        <span className="text-sm">Processing</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-purple-500 rounded"></div>
        <span className="text-sm">Frozen</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-400 rounded"></div>
        <span className="text-sm">Cancelled</span>
      </div>
    </div>
  );
};

export default SeatLegend;