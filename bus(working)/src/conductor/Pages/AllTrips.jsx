import React, { useState, useEffect } from 'react';
import ConductorLayout from '../components/ConductorLayout';
import { getConductorTrips } from '../../services/conductorService';
import { Calendar, MapPin, Clock, Users, Bus, AlertCircle, Loader } from 'lucide-react';

const AllTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conductorName, setConductorName] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await getConductorTrips();
      setTrips(data.trips);
      setConductorName(data.conductor_name);
    } catch (err) {
      setError('Failed to fetch trips');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (date) => {
    const tripDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (tripDate < today) {
      return 'bg-gray-100 text-gray-600'; // Past
    } else if (tripDate.toDateString() === today.toDateString()) {
      return 'bg-blue-100 text-blue-600'; // Today
    } else {
      return 'bg-green-100 text-green-600'; // Future
    }
  };

  const getStatusText = (date) => {
    const tripDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (tripDate < today) {
      return 'Completed';
    } else if (tripDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else {
      return 'Upcoming';
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    
    const tripDate = new Date(trip.departure_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filter === 'upcoming') {
      return tripDate >= today;
    } else if (filter === 'past') {
      return tripDate < today;
    }
    
    return true;
  });

  if (loading) {
    return (
      <ConductorLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your trips...</p>
          </div>
        </div>
      </ConductorLayout>
    );
  }

  if (error) {
    return (
      <ConductorLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Trips</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchTrips}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </ConductorLayout>
    );
  }

  return (
    <ConductorLayout>
      <div className="w-full max-w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All My Trips</h1>
          <p className="text-gray-600 mt-1">
            {conductorName && `Welcome, ${conductorName}! `}
            Manage and view all your assigned trips.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
              </div>
              <Bus className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Trips</p>
                <p className="text-2xl font-bold text-green-600">
                  {trips.filter(trip => new Date(trip.departure_date) >= new Date().setHours(0, 0, 0, 0)).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Trips</p>
                <p className="text-2xl font-bold text-blue-600">
                  {trips.filter(trip => new Date(trip.departure_date).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All Trips' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'past', label: 'Past' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trips List */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <Bus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You don't have any trips assigned yet."
                : `No ${filter} trips available.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Main Trip Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Bus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Bus {trip.bus_no}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trip.departure_date)}`}>
                            {getStatusText(trip.departure_date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      {/* Route */}
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {trip.start_point} → {trip.end_point}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {formatDate(trip.departure_date)}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {formatTime(trip.departure_time)}
                        </span>
                      </div>

                      {/* Seats */}
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {trip.booked_seats || 0}/{trip.total_seats || trip.available_seats + (trip.booked_seats || 0)} booked
                        </span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>Driver: {trip.driver_name}</span>
                        <span>Contact: {trip.driver_contact}</span>
                        <span>Duration: {trip.duration}</span>
                        <span>Price: Rs. {trip.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Status and Price */}
                  <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      Rs. {trip.price}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      per seat
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConductorLayout>
  );
};

export default AllTrips;
