import React from 'react';

const DateSelector = ({ dates, selectedDate, onChange, disabled }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-64">
      <label htmlFor="date-select" className="block mb-2 text-sm font-medium text-gray-700">
        Select Date
      </label>
      <select
        id="date-select"
        value={selectedDate}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`block w-full px-3 py-2 mt-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <option value="">Select a date</option>
        {dates.map((date) => (
          <option key={date} value={date}>
            {formatDate(date)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;