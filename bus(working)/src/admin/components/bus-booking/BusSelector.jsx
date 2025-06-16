import React from 'react';

const BusSelector = ({ buses, selectedBusNo, onChange }) => {
  return (
    <div className="w-48">
      <label htmlFor="bus-select" className="block mb-2 text-sm font-medium text-gray-700">
        Select Bus
      </label>
      <select
        id="bus-select"
        value={selectedBusNo}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-3 py-2 mt-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
      >
        <option value="">All Buses</option>
        {buses.map((bus) => (
          <option key={bus.id} value={bus.bus_no}>
            {bus.bus_no}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BusSelector;