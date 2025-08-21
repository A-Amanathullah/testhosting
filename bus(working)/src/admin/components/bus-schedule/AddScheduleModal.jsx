import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format, addDays, parseISO } from 'date-fns';
import { getAllBusRoutes } from '../../../services/busRouteService';

const AddScheduleModal = ({ isOpen, onClose, onSave, buses }) => {
  const initialFormData = {
    id: '',
    bus_no: '',
    driver_name: '',
    driver_contact: '',
    conductor_name: '',
    conductor_contact: '',
    departure_date: '',
    bus_route_id: '', // Add bus route selection
  };

  const [formData, setFormData] = useState(initialFormData);
  const [busRoutes, setBusRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  // Start with 1 schedule detail row
  const [scheduleDetails, setScheduleDetails] = useState([
    {
      date: '',
      start_point: '',
      end_point: '',
      price: '',
      departure_time: '',
      arrival_date: '',
      arrival_time: ''
    }
  ]);
  const [errors, setErrors] = useState({});

  // Fetch bus routes on component mount
  useEffect(() => {
    const fetchBusRoutes = async () => {
      try {
        const routes = await getAllBusRoutes();
        setBusRoutes(routes);
      } catch (error) {
        console.error('Failed to fetch bus routes:', error);
      }
    };
    
    if (isOpen) {
      fetchBusRoutes();
    }
  }, [isOpen]);

  useEffect(() => {
    // When bus or departure_date changes, auto-fill first row's date/start/end if possible
    if (formData.departure_date) {
      setScheduleDetails((prev) => {
        const updated = [...prev];
        if (!updated[0].date) updated[0].date = formData.departure_date;
        if (!updated[0].arrival_date) updated[0].arrival_date = formData.departure_date;
        if (formData.start_point) updated[0].start_point = formData.start_point;
        if (formData.end_point) updated[0].end_point = formData.end_point;
        return updated;
      });
    }
  }, [formData.departure_date, formData.start_point, formData.end_point]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'id') {
      const selectedBus = buses.find(bus => bus.id === parseInt(value));
      if (selectedBus) {
        setFormData({
          ...formData,
          id: value,
          bus_no: selectedBus.bus_no,
          driver_name: selectedBus.driver_name || '',
          driver_contact: selectedBus.contactNumber || '',
          start_point: selectedBus.start_point || '',
          end_point: selectedBus.end_point || '',
        });
        setScheduleDetails((prev) => {
          const updated = [...prev];
          if (selectedBus.start_point) updated[0].start_point = selectedBus.start_point;
          if (selectedBus.end_point) updated[0].end_point = selectedBus.end_point;
          return updated;
        });
      }
    }

    if (name === 'bus_route_id') {
      const route = busRoutes.find(r => r.id === parseInt(value));
      if (route) {
        setSelectedRoute(route);
        // Auto-fill start and end points from route
        setFormData(prev => ({
          ...prev,
          bus_route_id: value,
          start_point: route.start_location,
          end_point: route.end_location,
        }));
        // Update schedule details with route info
        setScheduleDetails((prev) => {
          const updated = [...prev];
          updated[0].start_point = route.start_location;
          updated[0].end_point = route.end_location;
          return updated;
        });
      }
    }

    // Update the first schedule detail when departure date changes
    if (name === 'departure_date' && value) {
      setScheduleDetails((prev) => {
        const updated = [...prev];
        updated[0].date = value;
        // Set arrival date to be one day after departure date
        const arrivalDate = addDays(parseISO(value), 1);
        updated[0].arrival_date = format(arrivalDate, 'yyyy-MM-dd');
        return updated;
      });
    }
  };

  const handleScheduleDetailChange = (index, field, value) => {
    const updatedScheduleDetails = [...scheduleDetails];
    updatedScheduleDetails[index] = {
      ...updatedScheduleDetails[index],
      [field]: value
    };
    
    // Auto-set arrival date to be one day after departure date when date changes
    if (field === 'date' && value) {
      const arrivalDate = addDays(parseISO(value), 1);
      updatedScheduleDetails[index].arrival_date = format(arrivalDate, 'yyyy-MM-dd');
    }
    
    // If this is the first row and departure/arrival time or price is being set, update all other rows
    if (index === 0 && (field === 'departure_time' || field === 'arrival_time' || field === 'price')) {
      updatedScheduleDetails.forEach((detail, i) => {
        if (i !== 0) { // Don't update the current row
          updatedScheduleDetails[i][field] = value;
        }
      });
    }
    
    setScheduleDetails(updatedScheduleDetails);
  };

  // Add a new schedule row (up to 30)
  const handleAddDay = () => {
    if (scheduleDetails.length < 30) {
      let nextDate = '';
      let nextArrivalDate = '';
      let defaultDepartureTime = '';
      let defaultArrivalTime = '';
      
      if (formData.departure_date) {
        // Try to auto-increment date if possible
        const lastDate = scheduleDetails[scheduleDetails.length - 1].date || formData.departure_date;
        const next = addDays(parseISO(lastDate), 1);
        nextDate = format(next, 'yyyy-MM-dd');
        // Set arrival date to be one day after departure date
        const arrivalNext = addDays(parseISO(nextDate), 1);
        nextArrivalDate = format(arrivalNext, 'yyyy-MM-dd');
      }
      
      // Use the departure and arrival time and price from the first row if available
      if (scheduleDetails.length > 0) {
        defaultDepartureTime = scheduleDetails[0].departure_time || '';
        defaultArrivalTime = scheduleDetails[0].arrival_time || '';
      }
      
      setScheduleDetails([
        ...scheduleDetails,
        {
          date: nextDate,
          start_point: formData.start_point || '',
          end_point: formData.end_point || '',
          price: scheduleDetails.length > 0 ? scheduleDetails[0].price : '',
          departure_time: defaultDepartureTime,
          arrival_date: nextArrivalDate,
          arrival_time: defaultArrivalTime
        }
      ]);
    }
  };

  // Remove a schedule row
  const handleRemoveDay = (index) => {
    if (scheduleDetails.length > 1) {
      setScheduleDetails(scheduleDetails.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id) newErrors.id = 'Please select a bus';
    if (!formData.bus_route_id) newErrors.bus_route_id = 'Please select a bus route';
    if (!formData.departure_date) newErrors.departure_date = 'Please select a departure date';
    if (!formData.conductor_name) newErrors.conductor_name = 'Please enter conductor name';
    if (!formData.conductor_contact) newErrors.conductor_contact = 'Please enter conductor contact';
    if (!formData.driver_name) newErrors.driver_name = 'Please enter driver name';
    if (!formData.driver_contact) newErrors.driver_contact = 'Please enter driver contact';

    // Validate only present schedule details
    const scheduleErrors = [];
    let hasScheduleError = false;

    scheduleDetails.forEach((detail, index) => {
      const dayErrors = {};
      if (!detail.date) {
        dayErrors.date = 'Required';
        hasScheduleError = true;
      }
      if (!detail.start_point) {
        dayErrors.start_point = 'Required';
        hasScheduleError = true;
      }
      if (!detail.end_point) {
        dayErrors.end_point = 'Required';
        hasScheduleError = true;
      }
      if (!detail.price) {
        dayErrors.price = 'Required';
        hasScheduleError = true;
      }
      if (!detail.departure_time) {
        dayErrors.departure_time = 'Required';
        hasScheduleError = true;
      }
      if (!detail.arrival_date) {
        dayErrors.arrival_date = 'Required';
        hasScheduleError = true;
      }
      scheduleErrors[index] = dayErrors;
    });

    if (hasScheduleError) {
      newErrors.scheduleDetails = scheduleErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newSchedules = scheduleDetails.map((detail, index) => ({
        id: parseInt(formData.id),
        bus_no: formData.bus_no,
        bus_route_id: parseInt(formData.bus_route_id),
        driver_name: formData.driver_name,
        driver_contact: formData.driver_contact,
        conductor_name: formData.conductor_name,
        conductor_contact: formData.conductor_contact,
        start_point: detail.start_point,
        end_point: detail.end_point,
        departure_date: detail.date,
        departure_time: detail.departure_time,
        price: detail.price,
        arrival_date: detail.arrival_date,
        arrival_time: detail.arrival_time
      }));

      onSave(newSchedules);
      setFormData(initialFormData);
      setSelectedRoute(null);
      setScheduleDetails([
        {
          date: '',
          start_point: '',
          end_point: '',
          price: '',
          departure_time: '',
          arrival_date: '',
          arrival_time: ''
        }
      ]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex flex-col w-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-xl">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">Add Bus Schedule</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={28} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow p-8 overflow-y-auto bg-gray-50">
          <form id="scheduleForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 mb-8 bg-white p-6 rounded-lg shadow-sm">
              {/* Bus Selection */}
              <div>
                <label htmlFor="id" className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Bus
                </label>
                <select
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${errors.id ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                >
                  <option value="">-- Select Bus --</option>
                  {buses.map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.bus_no} ({bus.start_point} - {bus.end_point})
                    </option>
                  ))}
                </select>
                {errors.id && (
                  <p className="mt-2 text-sm text-red-600">{errors.id}</p>
                )}
              </div>

              {/* Bus Route Selection */}
              <div>
                <label htmlFor="bus_route_id" className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Route
                </label>
                <select
                  id="bus_route_id"
                  name="bus_route_id"
                  value={formData.bus_route_id}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${errors.bus_route_id ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                >
                  <option value="">-- Select Route --</option>
                  {busRoutes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.route_name} ({route.start_location} → {route.end_location})
                    </option>
                  ))}
                </select>
                {errors.bus_route_id && (
                  <p className="mt-2 text-sm text-red-600">{errors.bus_route_id}</p>
                )}
                {selectedRoute && selectedRoute.stops && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">Route Stops:</p>
                    <p className="text-sm text-blue-600">
                      {selectedRoute.stops.map(stop => stop.location_name).join(' → ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Bus Number (Auto-filled) */}
              <div>
                <label htmlFor="bus_no" className="block text-sm font-semibold text-gray-700 mb-2">
                  Bus Number
                </label>
                <input
                  type="text"
                  id="bus_no"
                  name="bus_no"
                  value={formData.bus_no}
                  readOnly
                  className="block w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-base"
                />
              </div>

              {/* Driver Name */}
              <div>
                <label htmlFor="driver_name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Driver Name
                </label>
                <input
                  type="text"
                  id="driver_name"
                  name="driver_name"
                  value={formData.driver_name}
                  onChange={handleChange}
                  placeholder="Enter driver name"
                  className={`block w-full px-4 py-3 border ${errors.driver_name ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                />
                {errors.driver_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.driver_name}</p>
                )}
              </div>

              {/* Driver Contact */}
              <div>
                <label htmlFor="driver_contact" className="block text-sm font-semibold text-gray-700 mb-2">
                  Driver Contact
                </label>
                <input
                  type="text"
                  id="driver_contact"
                  name="driver_contact"
                  value={formData.driver_contact}
                  onChange={handleChange}
                  placeholder="Enter driver contact number"
                  className={`block w-full px-4 py-3 border ${errors.driver_contact ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                />
                {errors.driver_contact && (
                  <p className="mt-2 text-sm text-red-600">{errors.driver_contact}</p>
                )}
              </div>

              {/* Conductor Name */}
              <div>
                <label htmlFor="conductor_name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Conductor Name
                </label>
                <input
                  type="text"
                  id="conductor_name"
                  name="conductor_name"
                  value={formData.conductor_name}
                  onChange={handleChange}
                  placeholder="Enter conductor name"
                  className={`block w-full px-4 py-3 border ${errors.conductor_name ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                />
                {errors.conductor_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.conductor_name}</p>
                )}
              </div>

              {/* Conductor Contact */}
              <div>
                <label htmlFor="conductor_contact" className="block text-sm font-semibold text-gray-700 mb-2">
                  Conductor Contact
                </label>
                <input
                  type="text"
                  id="conductor_contact"
                  name="conductor_contact"
                  value={formData.conductor_contact}
                  onChange={handleChange}
                  placeholder="Enter conductor contact number"
                  className={`block w-full px-4 py-3 border ${errors.conductor_contact ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                />
                {errors.conductor_contact && (
                  <p className="mt-2 text-sm text-red-600">{errors.conductor_contact}</p>
                )}
              </div>

              {/* Initial Departure Date */}
              <div>
                <label htmlFor="departure_date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Starting Date
                </label>
                <input
                  type="date"
                  id="departure_date"
                  name="departure_date"
                  value={formData.departure_date}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${errors.departure_date ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
                />
                {errors.departure_date && (
                  <p className="mt-2 text-sm text-red-600">{errors.departure_date}</p>
                )}
              </div>
            </div>

            {/* Schedule Details Section */}
            {formData.departure_date && (
              <div className="mt-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Schedule Details (up to 30 days)
                </h3>
                <div className="mb-4 flex items-center gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={handleAddDay}
                    disabled={scheduleDetails.length >= 30}
                  >
                    + Add Day
                  </button>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    {scheduleDetails.length} / 30 days
                  </span>
                  <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    💡 Times & prices from first row auto-apply to new days
                  </div>
                </div>
                
                <div className="mb-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Arrival dates auto-set to +1 day from departure date. 
                    Departure/arrival times and prices from the first row will automatically apply to new rows (editable).
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          Date
                        </th>
                        <th className="px-3 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          From Location
                        </th>
                        <th className="px-3 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          To Location
                        </th>
                        <th className="px-3 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          Departure Time
                          <span className="text-xs font-normal text-blue-600 block normal-case">
                            (1st row syncs all)
                          </span>
                        </th>
                        <th className="px-3 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          Arrival Date
                          <span className="text-xs font-normal text-green-600 block normal-case">
                            (auto +1 day)
                          </span>
                        </th>
                        <th className="px-3 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          Arrival Time
                          <span className="text-xs font-normal text-blue-600 block normal-case">
                            (1st row syncs all)
                          </span>
                        </th>
                        <th className="px-3 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          Price (₹)
                          <span className="text-xs font-normal text-blue-600 block normal-case">
                            (1st row syncs all)
                          </span>
                        </th>
                        <th className="px-3 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {scheduleDetails.map((detail, index) => (
                        <tr key={index}>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                            <input
                              type="date"
                              value={detail.date}
                              onChange={(e) =>
                                handleScheduleDetailChange(index, 'date', e.target.value)
                              }
                              className={`w-full px-3 py-2 border ${errors.scheduleDetails?.[index]?.date ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.scheduleDetails?.[index]?.date && (
                              <p className="text-xs text-red-600 mt-1">{errors.scheduleDetails[index].date}</p>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <input
                              type="text"
                              value={detail.start_point}
                              onChange={(e) =>
                                handleScheduleDetailChange(index, 'start_point', e.target.value)
                              }
                              placeholder="From location"
                              className={`w-full px-3 py-2 border ${errors.scheduleDetails?.[index]?.start_point ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.scheduleDetails?.[index]?.start_point && (
                              <p className="text-xs text-red-600 mt-1">{errors.scheduleDetails[index].start_point}</p>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <input
                              type="text"
                              value={detail.end_point}
                              onChange={(e) =>
                                handleScheduleDetailChange(index, 'end_point', e.target.value)
                              }
                              placeholder="To location"
                              className={`w-full px-3 py-2 border ${errors.scheduleDetails?.[index]?.end_point ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.scheduleDetails?.[index]?.end_point && (
                              <p className="text-xs text-red-600 mt-1">{errors.scheduleDetails[index].end_point}</p>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <input
                              type="time"
                              value={detail.departure_time}
                              onChange={(e) =>
                                handleScheduleDetailChange(index, 'departure_time', e.target.value)
                              }
                              className={`w-full px-3 py-2 border ${errors.scheduleDetails?.[index]?.departure_time ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.scheduleDetails?.[index]?.departure_time && (
                              <p className="text-xs text-red-600 mt-1">{errors.scheduleDetails[index].departure_time}</p>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <input
                              type="date"
                              id="arrival_date"
                              value={detail.arrival_date}
                              onChange={(e) =>
                                handleScheduleDetailChange(index, 'arrival_date', e.target.value)
                              }
                              className={`w-full px-3 py-2 border ${errors.scheduleDetails?.[index]?.arrival_date ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.scheduleDetails?.[index]?.arrival_date && (
                              <p className="text-xs text-red-600 mt-1">{errors.scheduleDetails[index].arrival_date}</p>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <input
                              type="time"
                              id="arrival_time"
                              value={detail.arrival_time}
                              onChange={(e) =>
                                handleScheduleDetailChange(index, 'arrival_time', e.target.value)
                              }
                              className={`w-full px-3 py-2 border ${errors.scheduleDetails?.[index]?.arrival_time ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.scheduleDetails?.[index]?.arrival_time && (
                              <p className="text-xs text-red-600 mt-1">{errors.scheduleDetails[index].arrival_time}</p>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              value={detail.price}
                              onChange={(e) =>
                                handleScheduleDetailChange(index, 'price', e.target.value)
                              }
                              placeholder="Price"
                              className={`w-full px-3 py-2 border ${errors.scheduleDetails?.[index]?.price ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.scheduleDetails?.[index]?.price && (
                              <p className="text-xs text-red-600 mt-1">{errors.scheduleDetails[index].price}</p>
                            )}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                              onClick={() => handleRemoveDay(index)}
                              disabled={scheduleDetails.length === 1}
                              title="Remove this day"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end mt-8 space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-red-800 border border-transparent rounded-lg hover:bg-red-900 transition-colors"
              >
                Save Schedule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddScheduleModal;
