import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConductorLayout from '../components/ConductorLayout';
import { getConductorTripDetails } from '../../services/conductorService';
import { RiSteering2Fill } from "react-icons/ri";
import { 
  ArrowLeft, 
  Bus, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Calendar,
  Users,
  Banknote,
  AlertCircle,
  Loader,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getConductorTripDetails(tripId);
        console.log('Trip data received:', data.trip); // Debug log
        setTripData(data.trip);
      } catch (err) {
        setError('Failed to fetch trip details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const data = await getConductorTripDetails(tripId);
      setTripData(data.trip);
    } catch (err) {
      setError('Failed to fetch trip details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    try {
      // Handle different time formats (HH:MM:SS or HH:MM)
      const timeOnly = timeString.split(' ')[0]; // Remove any timezone info
      const [hours, minutes] = timeOnly.split(':');
      
      if (!hours || !minutes) return timeString; // Return original if parsing fails
      
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error, timeString);
      return timeString; // Return original string if formatting fails
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      // Handle different date formats
      let date;
      
      // Try parsing as ISO date first
      if (dateString.includes('T')) {
        date = new Date(dateString);
      } else if (dateString.includes('-')) {
        // Handle YYYY-MM-DD format
        const [year, month, day] = dateString.split('-');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        // Fallback to direct parsing
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return dateString; // Return original string if invalid
      }
      
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return dateString; // Return original string if formatting fails
    }
  };

  const getSeatStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'frozen':
        return 'bg-blue-500 text-white';
      case 'available':
        return 'bg-green-100 text-green-800 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeatStatusIcon = (status) => {
    switch (status) {
      case 'booked':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Timer className="w-3 h-3" />;
      case 'frozen':
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ConductorLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading trip details...</p>
          </div>
        </div>
      </ConductorLayout>
    );
  }

  if (error || !tripData) {
    return (
      <ConductorLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Trip Details</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-3">
              <button
                onClick={fetchTripDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </ConductorLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Bus },
    { id: 'seats', label: 'Seat Plan', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: User },
    { id: 'bus', label: 'Bus Details', icon: Bus }
  ];

  return (
    <ConductorLayout>
      <div className="w-full max-w-full">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Today's Trips</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trip Details</h1>
              <p className="text-gray-600 mt-1">
                Bus {tripData.bus_no} • {tripData.route}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Departure</div>
              <div className="text-xl font-bold text-blue-600">
                {formatTime(tripData.departure_time)}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{tripData.booked_seats}</div>
              <div className="text-sm text-gray-600">Booked</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{tripData.pending_seats}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{tripData.frozen_seats}</div>
              <div className="text-sm text-gray-600">Frozen</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{tripData.available_seats}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === 'overview' && (
              <OverviewTab tripData={tripData} formatTime={formatTime} formatDate={formatDate} />
            )}
            {selectedTab === 'seats' && (
              <SeatPlanTab 
                seatLayout={tripData.seat_layout} 
                getSeatStatusColor={getSeatStatusColor}
                getSeatStatusIcon={getSeatStatusIcon}
              />
            )}
            {selectedTab === 'bookings' && (
              <BookingsTab 
                bookings={tripData.bookings} 
                getBookingStatusColor={getBookingStatusColor}
              />
            )}
            {selectedTab === 'bus' && (
              <BusDetailsTab busDetails={tripData.bus_details} />
            )}
          </div>
        </div>
      </div>
    </ConductorLayout>
  );
};

// Tab Components
const OverviewTab = ({ tripData, formatTime, formatDate }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Trip Information</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">{tripData.route}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">{formatDate(tripData.departure_date)}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">
              {formatTime(tripData.departure_time)} - {formatTime(tripData.arrival_time)}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Banknote className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Rs. {tripData.price} per seat</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Staff Information</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Driver: {tripData.driver_name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">{tripData.driver_contact}</span>
          </div>
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Conductor: {tripData.conductor_name}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SeatPlanTab = ({ seatLayout, getSeatStatusColor, getSeatStatusIcon }) => {
  // Parse seat layout data to create proper seat mapping
  const seatStatusMap = {};
  
  // Initialize all seats as available based on seat layout
  seatLayout.forEach(seat => {
    seatStatusMap[seat.number] = seat.status;
  });

  // Function to render main rows (seats 1-40) similar to SeatPlanning.js
  const renderMainRows = () => {
    let seatNum = 1;
    const rows = [];
    
    for (let r = 0; r < 10; r++) {
      const row = [];
      for (let c = 0; c < 5; c++) {
        if (c === 2) {
          // Aisle space
          row.push(<div key={`aisle-${r}-${c}`} className="w-14"></div>);
          continue;
        }
        
        const seatNumber = seatNum++;
        const seatData = seatLayout.find(seat => seat.number === seatNumber);
        const status = seatData?.status || 'available';
        const passenger = seatData?.passenger || '';
        
        let seatColor = "bg-gray-200";
        if (status === "booked") {
          seatColor = "bg-red-600 text-white";
        } else if (status === "pending") {
          seatColor = "bg-yellow-500 text-white";
        } else if (status === "frozen") {
          seatColor = "bg-blue-500 text-white";
        } else {
          seatColor = "bg-gray-200";
        }

        const Icon = getSeatStatusIcon(status);
        
        row.push(
          <div
            key={seatNumber}
            className={`w-20 h-16 rounded-md m-1 text-lg font-semibold flex items-center justify-center relative cursor-default ${seatColor}`}
            title={`Seat ${seatNumber} - ${status}${passenger ? ` (${passenger})` : ''}`}
          >
            {Icon && (
              <span className="absolute top-0.5 left-0.5">
                {Icon}
              </span>
            )}
            <span>S{seatNumber}</span>
          </div>
        );
      }
      rows.push(
        <div key={`row-${r}`} className="flex justify-center mb-1">
          {row}
        </div>
      );
    }
    return rows;
  };

  // Function to render back row (seats 41+) similar to SeatPlanning.js
  const renderBackRow = () => {
    const row = [];
    const totalSeats = seatLayout.length;
    
    for (let i = totalSeats; i >= 41; i--) {
      const seatData = seatLayout.find(seat => seat.number === i);
      const status = seatData?.status || 'available';
      const passenger = seatData?.passenger || '';
      
      let seatColor = "bg-gray-200";
      if (status === "booked") {
        seatColor = "bg-red-600 text-white";
      } else if (status === "pending") {
        seatColor = "bg-yellow-500 text-white";
      } else if (status === "frozen") {
        seatColor = "bg-blue-500 text-white";
      } else {
        seatColor = "bg-gray-200";
      }

      const Icon = getSeatStatusIcon(status);
      
      row.push(
        <div
          key={i}
          className={`w-20 h-16 rounded-md m-1 text-lg font-semibold flex items-center justify-center relative cursor-default ${seatColor}`}
          title={`Seat ${i} - ${status}${passenger ? ` (${passenger})` : ''}`}
        >
          {Icon && (
            <span className="absolute top-0.5 left-0.5">
              {Icon}
            </span>
          )}
          <span>S{i}</span>
        </div>
      );
    }
    return <div className="flex justify-center mt-2">{row}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Seat Layout</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Frozen</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
            <span>Available</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-xl rounded-xl max-w-full md:max-w-md mx-auto p-4">
        <h2 className="text-base sm:text-lg font-bold mb-2 text-center">Bus Seat Layout</h2>
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-xs sm:text-sm text-gray-500">Front</span>
          <span className="font-medium text-gray-600 flex items-center gap-1">
            Driver <span role="img"><RiSteering2Fill className="text-xl sm:text-2xl" /></span>
          </span>
        </div>
        {renderMainRows()}
        {renderBackRow()}
        <div className="mt-4">
          <div className="flex justify-evenly flex-wrap gap-1 sm:gap-2">
            <div className="flex gap-1 items-center">
              <span className="text-xs sm:text-sm">Available:</span>
              <div className="bg-gray-200 h-3 w-6 sm:h-4 sm:w-8 rounded-lg"></div>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-xs sm:text-sm">Booked:</span>
              <div className="bg-red-600 h-3 w-6 sm:h-4 sm:w-8 rounded-lg"></div>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-xs sm:text-sm">Pending:</span>
              <div className="bg-yellow-500 h-3 w-6 sm:h-4 sm:w-8 rounded-lg"></div>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-xs sm:text-sm">Frozen:</span>
              <div className="bg-blue-500 h-3 w-6 sm:h-4 sm:w-8 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingsTab = ({ bookings, getBookingStatusColor }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">Passenger Bookings</h3>
    <div className="space-y-3">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h4 className="font-medium text-gray-900">{booking.passenger_name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBookingStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Seat {booking.seat_number} • {booking.phone} • Rs. {booking.amount}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Booked on {new Date(booking.booking_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BusDetailsTab = ({ busDetails }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900">Bus Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Make & Model:</span>
          <span className="font-medium">{busDetails.make} {busDetails.model}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Registration:</span>
          <span className="font-medium">{busDetails.registration}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Capacity:</span>
          <span className="font-medium">{busDetails.capacity} seats</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="text-gray-600">Amenities:</div>
        <div className="flex flex-wrap gap-2">
          {busDetails.amenities.map((amenity, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default TripDetails;