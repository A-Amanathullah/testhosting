import React from 'react';
import { X, MapPin, Clock, Route } from 'lucide-react';

const ViewRouteModal = ({ isOpen, onClose, route }) => {
  if (!isOpen || !route) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Route Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Route Information */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{route.route_name}</h3>
              {route.route_code && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {route.route_code}
                </span>
              )}
            </div>
            {route.description && (
              <p className="text-gray-600 mb-4">{route.description}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Location */}
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Start Location</p>
                  <p className="text-lg font-semibold text-green-900">{route.start_location}</p>
                </div>
              </div>

              {/* End Location */}
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                <div className="p-2 bg-red-100 rounded-full">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">End Location</p>
                  <p className="text-lg font-semibold text-red-900">{route.end_location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Route Stops */}
          {route.stops && route.stops.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Route className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Route Stops ({route.stops.length})
                </h3>
              </div>

              <div className="space-y-4">
                {route.stops.map((stop, index) => (
                  <div 
                    key={stop.id || index} 
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Stop Number */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
                        {stop.stop_order}
                      </div>
                    </div>

                    {/* Stop Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-medium text-gray-900 truncate">
                        {stop.location_name}
                      </h4>
                      
                      <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                        {stop.distance_from_start > 0 && (
                          <div className="flex items-center space-x-1">
                            <Route className="w-4 h-4" />
                            <span>{stop.distance_from_start} km</span>
                          </div>
                        )}
                        
                        {stop.duration_from_start > 0 && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{stop.duration_from_start} min</span>
                          </div>
                        )}
                        
                        {stop.fare_from_start > 0 && (
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">LKR {stop.fare_from_start}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Connection Line (not for last stop) */}
                    {index < route.stops.length - 1 && (
                      <div className="absolute left-8 mt-12 w-0.5 h-6 bg-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Route Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Route Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Stops</p>
                    <p className="font-semibold text-gray-900">{route.stops.length}</p>
                  </div>
                  
                  {route.stops.length > 0 && route.stops[route.stops.length - 1].distance_from_start > 0 && (
                    <div>
                      <p className="text-gray-500">Total Distance</p>
                      <p className="font-semibold text-gray-900">
                        {route.stops[route.stops.length - 1].distance_from_start} km
                      </p>
                    </div>
                  )}
                  
                  {route.stops.length > 0 && route.stops[route.stops.length - 1].duration_from_start > 0 && (
                    <div>
                      <p className="text-gray-500">Total Duration</p>
                      <p className="font-semibold text-gray-900">
                        {Math.floor(route.stops[route.stops.length - 1].duration_from_start / 60)}h {route.stops[route.stops.length - 1].duration_from_start % 60}m
                      </p>
                    </div>
                  )}
                  
                  {route.stops.length > 0 && route.stops[route.stops.length - 1].fare_from_start > 0 && (
                    <div>
                      <p className="text-gray-500">Full Fare</p>
                      <p className="font-semibold text-gray-900">
                        LKR {route.stops[route.stops.length - 1].fare_from_start}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* No Stops Message */}
          {(!route.stops || route.stops.length === 0) && (
            <div className="text-center py-8">
              <Route className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Intermediate Stops</h3>
              <p className="text-gray-500">
                This route operates as a direct service from {route.start_location} to {route.end_location}.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRouteModal;
