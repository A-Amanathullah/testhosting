import React from 'react';

const BusForm = ({ formData, onChange, errors = {} }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Bus Number</label>
        <input 
          type="text" 
          name="bus_no"
          value={formData.bus_no|| ''}
          onChange={onChange}
          className={`block w-full px-3 py-2 mt-1 border ${
            errors.bus_no ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          required
        />
        {errors.bus_no && (
          <p className="mt-1 text-sm text-red-600">{errors.bus_no}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">From Location</label>
          <input 
            type="text" 
            name="start_point"
            value={formData.start_point|| ''}
            onChange={onChange}
            className={`block w-full px-3 py-2 mt-1 border ${
              errors.start_point ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.start_point && (
            <p className="mt-1 text-sm text-red-600">{errors.start_point}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">To Location</label>
          <input 
            type="text" 
            name="end_point"
            value={formData.end_point|| ''}
            onChange={onChange}
            className={`block w-full px-3 py-2 mt-1 border ${
              errors.end_point ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.end_point && (
            <p className="mt-1 text-sm text-red-600">{errors.end_point}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Seats</label>
        <input 
          type="number" 
          name="total_seats"
          value={formData.total_seats|| ''}
          onChange={onChange}
          min="1"
          className={`block w-full px-3 py-2 mt-1 border ${
            errors.total_seats ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          required
        />
        {errors.total_seats && (
          <p className="mt-1 text-sm text-red-600">{errors.total_seats}</p>
        )}
      </div>
    </div>
  );
};

export default BusForm;