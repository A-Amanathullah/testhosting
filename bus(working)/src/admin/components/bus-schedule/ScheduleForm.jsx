import React from 'react';

const ScheduleForm = ({ formData, onChange, buses, busRoutes = [], errors = {} }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Bus Number</label>
        <select
          name="id"
          value={formData.id}
          onChange={onChange}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
            errors.id ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          required
        >
          <option value="">Select a bus</option>
          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {bus.bus_no}
            </option>
          ))}
        </select>
        {errors.id && (
          <p className="mt-1 text-sm text-red-600">{errors.id}</p>
        )}
      </div>

      {/* Bus Route Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Bus Route</label>
        <select
          name="bus_route_id"
          value={formData.bus_route_id || ''}
          onChange={onChange}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
            errors.bus_route_id ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          required
        >
          <option value="">Select a route</option>
          {busRoutes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.route_name} ({route.start_location} → {route.end_location})
            </option>
          ))}
        </select>
        {errors.bus_route_id && (
          <p className="mt-1 text-sm text-red-600">{errors.bus_route_id}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Driver Name</label>
          <input 
            type="text" 
            name="driver_name"
            value={formData.driver_name}
            onChange={onChange}
            className={`block w-full px-3 py-2 mt-1 border ${
              errors.driver_name ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.driver_name && (
            <p className="mt-1 text-sm text-red-600">{errors.driver_name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Driver Contact</label>
          <input 
            type="tel" 
            name="driver_contact"
            value={formData.driver_contact}
            onChange={onChange}
            className={`block w-full px-3 py-2 mt-1 border ${
              errors.driver_contact ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.driver_contact && (
            <p className="mt-1 text-sm text-red-600">{errors.driver_contact}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Conductor Name</label>
          <input 
            type="text" 
            name="conductor_name"
            value={formData.conductor_name}
            onChange={onChange}
            className={`block w-full px-3 py-2 mt-1 border ${
              errors.conductor_name ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.conductor_name && (
            <p className="mt-1 text-sm text-red-600">{errors.conductor_name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Conductor Contact</label>
          <input 
            type="tel" 
            name="conductor_contact"
            value={formData.conductor_contact}
            onChange={onChange}
            className={`block w-full px-3 py-2 mt-1 border ${
              errors.conductor_contact ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.conductor_contact && (
            <p className="mt-1 text-sm text-red-600">{errors.conductor_contact}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">From Location</label>
          <input 
            type="text" 
            name="start_point"
            value={formData.start_point}
            onChange={onChange}
            placeholder="e.g. Colombo"
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
            value={formData.end_point}
            onChange={onChange}
            placeholder="e.g. Kalmunai"
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
      
      {/* New Fields: Departure Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Departure Date</label>
          <input 
            type="date" 
            name="departure_date"
            value={formData.departure_date}
            onChange={onChange}
            className={`block w-full px-3 py-2 mt-1 border ${
              errors.departure_date ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.departure_date && (
            <p className="mt-1 text-sm text-red-600">{errors.departure_date}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Departure Time</label>
          <input 
            type="time" 
            name="departure_time"
            value={formData.departure_time}
            onChange={onChange}
            className={`block w-full px-3 py-2 mt-1 border ${
              errors.departure_time ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.departure_time && (
            <p className="mt-1 text-sm text-red-600">{errors.departure_time}</p>
          )}
        </div>
      </div>
      
      {/* New Fields: Price and Booking Closing Time */}
      <div>
          <label className="block text-sm font-medium text-gray-700">Arrival Date</label>
          <input 
            type="date" 
            name="arrival_date"
            value={formData.arrival_date}
            onChange={onChange}
            className={`block w-full px-3 py-2 mt-1 border ${
              errors.arrival_date ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.arrival_date && (
            <p className="mt-1 text-sm text-red-600">{errors.arrival_date}</p>
          )}
        </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
          <input 
            type="time" 
            name="arrival_time"
            value={formData.arrival_time}
            onChange={onChange}
            className={`block w-full px-3 py-2 mt-1 border ${
              errors.arrival_time ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.arrival_time && (
            <p className="mt-1 text-sm text-red-600">{errors.arrival_time}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ticket Price (Rs)</label>
          <input 
            type="number" 
            name="price"
            value={formData.price}
            onChange={onChange}
            min="0"
            step="1"
            placeholder="e.g. 1500.00"
            className={`block w-full px-3 py-2 mt-1 border ${
              errors.price ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;