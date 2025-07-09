import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, MapPin } from 'lucide-react';
import locationService from '../../../services/locationService';

const EditRouteModal = ({ isOpen, onClose, onSave, route }) => {
  const [formData, setFormData] = useState({
    route_code: '',
    route_name: '',
    start_location: '',
    end_location: '',
    description: '',
    stops: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState({});

  useEffect(() => {
    if (isOpen && route) {
      // Populate form with route data
      setFormData({
        route_code: route.route_code || '',
        route_name: route.route_name || '',
        start_location: route.start_location || '',
        end_location: route.end_location || '',
        description: route.description || '',
        stops: route.stops ? route.stops.map(stop => ({
          id: stop.id,
          stop_name: stop.location_name,
          stop_order: stop.stop_order,
          distance_from_start: stop.distance_from_start || 0,
          duration_from_start: stop.duration_from_start || 0,
          fare_from_start: stop.fare_from_start || 0
        })) : []
      });
      setErrors({});
    }
  }, [isOpen, route]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLocationSearch = async (field, query) => {
    if (query.length < 2) {
      setLocationSuggestions(prev => ({
        ...prev,
        [field]: []
      }));
      return;
    }

    try {
      const locations = await locationService.searchLocations(query);
      setLocationSuggestions(prev => ({
        ...prev,
        [field]: locations.slice(0, 5) // Limit to 5 suggestions
      }));
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  const handleLocationSelect = (field, location) => {
    setFormData(prev => ({
      ...prev,
      [field]: location.name
    }));
    setLocationSuggestions(prev => ({
      ...prev,
      [field]: []
    }));
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [
        ...prev.stops,
        {
          stop_name: '',
          stop_order: prev.stops.length + 1,
          distance_from_start: 0,
          duration_from_start: 0,
          fare_from_start: 0
        }
      ]
    }));
  };

  const removeStop = (index) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index).map((stop, i) => ({
        ...stop,
        stop_order: i + 1
      }))
    }));
  };

  const updateStop = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => 
        i === index ? { ...stop, [field]: value } : stop
      )
    }));
  };

  const handleStopLocationSearch = async (index, query) => {
    if (query.length < 2) {
      setLocationSuggestions(prev => ({
        ...prev,
        [`stop_${index}`]: []
      }));
      return;
    }

    try {
      const locations = await locationService.searchLocations(query);
      setLocationSuggestions(prev => ({
        ...prev,
        [`stop_${index}`]: locations.slice(0, 5)
      }));
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  const handleStopLocationSelect = (index, location) => {
    updateStop(index, 'stop_name', location.name);
    setLocationSuggestions(prev => ({
      ...prev,
      [`stop_${index}`]: []
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.route_name.trim()) {
      newErrors.route_name = 'Route name is required';
    }

    if (!formData.start_location.trim()) {
      newErrors.start_location = 'Start location is required';
    }

    if (!formData.end_location.trim()) {
      newErrors.end_location = 'End location is required';
    }

    if (formData.start_location === formData.end_location) {
      newErrors.end_location = 'End location must be different from start location';
    }

    // Validate stops
    formData.stops.forEach((stop, index) => {
      if (!stop.stop_name.trim()) {
        newErrors[`stop_${index}_name`] = 'Stop name is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(route.id, formData);
      onClose();
    } catch (error) {
      console.error('Error saving route:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Bus Route</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Route Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route Code *
              </label>
              <input
                type="text"
                name="route_code"
                value={formData.route_code}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.route_code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., R001"
              />
              {errors.route_code && (
                <p className="mt-1 text-sm text-red-600">{errors.route_code}</p>
              )}
            </div>

            {/* Route Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route Name *
              </label>
              <input
                type="text"
                name="route_name"
                value={formData.route_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.route_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Colombo - Kandy Express"
              />
              {errors.route_name && (
                <p className="mt-1 text-sm text-red-600">{errors.route_name}</p>
              )}
            </div>

            {/* Start Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Location *
              </label>
              <input
                type="text"
                name="start_location"
                value={formData.start_location}
                onChange={(e) => {
                  handleInputChange(e);
                  handleLocationSearch('start_location', e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.start_location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Search for start location..."
              />
              {errors.start_location && (
                <p className="mt-1 text-sm text-red-600">{errors.start_location}</p>
              )}
              
              {/* Location suggestions */}
              {locationSuggestions.start_location && locationSuggestions.start_location.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {locationSuggestions.start_location.map((location, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLocationSelect('start_location', location)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{location.name}</span>
                        {location.district && (
                          <span className="text-sm text-gray-500 ml-2">({location.district})</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* End Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Location *
              </label>
              <input
                type="text"
                name="end_location"
                value={formData.end_location}
                onChange={(e) => {
                  handleInputChange(e);
                  handleLocationSearch('end_location', e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.end_location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Search for end location..."
              />
              {errors.end_location && (
                <p className="mt-1 text-sm text-red-600">{errors.end_location}</p>
              )}
              
              {/* Location suggestions */}
              {locationSuggestions.end_location && locationSuggestions.end_location.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {locationSuggestions.end_location.map((location, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLocationSelect('end_location', location)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{location.name}</span>
                        {location.district && (
                          <span className="text-sm text-gray-500 ml-2">({location.district})</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional description of the route..."
              />
            </div>
          </div>

          {/* Route Stops */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Route Stops</h3>
              <button
                type="button"
                onClick={addStop}
                className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Stop
              </button>
            </div>

            {formData.stops.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No stops added yet</p>
                <p className="text-sm text-gray-400">Add intermediate stops for this route</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.stops.map((stop, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Stop {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeStop(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Stop Name */}
                      <div className="relative md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stop Name *
                        </label>
                        <input
                          type="text"
                          value={stop.stop_name}
                          onChange={(e) => {
                            updateStop(index, 'stop_name', e.target.value);
                            handleStopLocationSearch(index, e.target.value);
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`stop_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Search for stop location..."
                        />
                        {errors[`stop_${index}_name`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`stop_${index}_name`]}</p>
                        )}
                        
                        {/* Stop location suggestions */}
                        {locationSuggestions[`stop_${index}`] && locationSuggestions[`stop_${index}`].length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                            {locationSuggestions[`stop_${index}`].map((location, locIndex) => (
                              <button
                                key={locIndex}
                                type="button"
                                onClick={() => handleStopLocationSelect(index, location)}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                              >
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                  <span>{location.name}</span>
                                  {location.district && (
                                    <span className="text-sm text-gray-500 ml-2">({location.district})</span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Distance */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Distance (km)
                        </label>
                        <input
                          type="number"
                          value={stop.distance_from_start}
                          onChange={(e) => updateStop(index, 'distance_from_start', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.1"
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration (min)
                        </label>
                        <input
                          type="number"
                          value={stop.duration_from_start}
                          onChange={(e) => updateStop(index, 'duration_from_start', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRouteModal;
