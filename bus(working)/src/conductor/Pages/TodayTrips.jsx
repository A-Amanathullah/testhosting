import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConductorLayout from '../components/ConductorLayout';
import { getConductorTrips } from '../../services/conductorService';
import { Calendar, MapPin, Clock, Users, Bus, AlertCircle, Loader, CheckCircle, Eye } from 'lucide-react';

const TodayTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conductorName, setConductorName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayTrips();
  }, []);

  const fetchTodayTrips = async () => {
    try {
      setLoading(true);
      const data = await getConductorTrips();
      
      // Filter for today's trips only
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayTrips = data.trips.filter(trip => {
        const tripDate = new Date(trip.departure_date);
        return tripDate.toDateString() === today.toDateString();
      });
      
      setTrips(todayTrips);
      setConductorName(data.conductor_name);
    } catch (err) {
      setError('Failed to fetch today\'s trips');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTripStatus = (departureTime) => {
    const now = new Date();
    const tripTime = new Date(`${new Date().toDateString()} ${departureTime}`);
    const diffInMinutes = (tripTime - now) / (1000 * 60);
    
    if (diffInMinutes < -60) {
      return { status: 'Completed', color: 'bg-gray-100 text-gray-600', icon: CheckCircle };
    } else if (diffInMinutes < 0) {
      return { status: 'In Progress', color: 'bg-orange-100 text-orange-600', icon: Bus };
    } else if (diffInMinutes <= 30) {
      return { status: 'Departing Soon', color: 'bg-red-100 text-red-600', icon: AlertCircle };
    } else {
      return { status: 'Scheduled', color: 'bg-blue-100 text-blue-600', icon: Clock };
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <ConductorLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading today's trips...</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Today's Trips</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchTodayTrips}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </ConductorLayout>
    );
  }

  const currentTime = getCurrentTime();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <ConductorLayout>
      <div className="w-full max-w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Today's Trips</h1>
          <p className="text-gray-600 mt-1">
            {conductorName && `Welcome, ${conductorName}! `}
            {currentDate} • Current time: {currentTime}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Today</p>
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-600">
                  {trips.filter(trip => {
                    const now = new Date();
                    const tripTime = new Date(`${new Date().toDateString()} ${trip.departure_time}`);
                    return (tripTime - now) / (1000 * 60) < -60;
                  }).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">
                  {trips.filter(trip => {
                    const now = new Date();
                    const tripTime = new Date(`${new Date().toDateString()} ${trip.departure_time}`);
                    const diffInMinutes = (tripTime - now) / (1000 * 60);
                    return diffInMinutes < 0 && diffInMinutes >= -60;
                  }).length}
                </p>
              </div>
              <Bus className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-green-600">
                  {trips.filter(trip => {
                    const now = new Date();
                    const tripTime = new Date(`${new Date().toDateString()} ${trip.departure_time}`);
                    return (tripTime - now) / (1000 * 60) >= 0;
                  }).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Trips List */}
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips scheduled for today</h3>
            <p className="text-gray-600">
              You don't have any trips assigned for today. Enjoy your day off!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips
              .sort((a, b) => a.departure_time.localeCompare(b.departure_time))
              .map((trip) => {
                const tripStatus = getTripStatus(trip.departure_time);
                const StatusIcon = tripStatus.icon;
                
                return (
                  <div key={trip.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${tripStatus.color}`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {tripStatus.status}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Departs at {formatTime(trip.departure_time)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          {/* Route */}
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {trip.start_point} → {trip.end_point}
                            </span>
                          </div>

                          {/* Time */}
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Duration: {trip.duration}
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
                            <span>Price: Rs. {trip.price} per seat</span>
                          </div>
                        </div>
                      </div>

                      {/* Trip Status and Actions */}
                      <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatTime(trip.departure_time)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Departure Time
                        </div>
                        <div className="mt-2 text-lg font-semibold text-gray-700">
                          Rs. {trip.price}
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => navigate(`/conductor/trip/${trip.id}`)}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </ConductorLayout>
  );
};

export default TodayTrips;