import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaBus, FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaMoneyBillWave } from 'react-icons/fa';

const ConfirmBooking = ({ selectedSeats, onClose, onConfirm, trip, onAgentBookForPassenger, isLoading = false, userRole }) => {
  const { user } = useContext(AuthContext);
  const seatPrice = trip?.price || 0; // Use trip price if available, otherwise default to 0
  const totalAmount = selectedSeats.length * seatPrice;
  
  // Log role information for debugging
  console.log("ConfirmBooking - User role from context:", user?.role);
  console.log("ConfirmBooking - User role from props:", userRole);    const handleConfirm = () => {
    console.log("ConfirmBooking: handleConfirm called");
    onConfirm();
  };
  
  const handleBookForPassenger = () => {
    console.log("ConfirmBooking: handleBookForPassenger called");
    if (onAgentBookForPassenger) {
      onAgentBookForPassenger();
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            <FaTimes className="text-xl" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <FaBus className="text-2xl" />
            <h2 className="text-2xl font-bold">Confirm Booking</h2>
          </div>
          <p className="text-blue-100">Review your journey details before payment</p>
        </div>

        {/* Booking Details */}
        <div className="p-6">
          {/* Trip Information */}
          <div className="border border-gray-200 rounded-lg p-4 bg-blue-50 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FaBus className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Journey Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <span className="font-medium">Route:</span>
                  <span className="text-gray-700">{trip?.start_point} → {trip?.end_point}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-gray-500" />
                  <span className="font-medium">Date:</span>
                  <span className="text-gray-700">{today}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaTicketAlt className="text-gray-500" />
                  <span className="font-medium">Bus:</span>
                  <span className="text-gray-700">{trip?.bus_no}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Seats:</span>
                  <span className="text-blue-600 font-semibold">{selectedSeats.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
            <div className="flex items-center gap-2 mb-3">
              <FaMoneyBillWave className="text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Price Details</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              {selectedSeats.map((seat, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Seat {seat}</span>
                  <span className="text-gray-700">Rs. {seatPrice.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-3 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          
          {(user?.role?.toLowerCase() === 'agent' || userRole?.toLowerCase() === 'agent') ? (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <button
                onClick={onConfirm}
                className="px-4 sm:px-6 py-3 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  'Confirm (Agent)'
                )}
              </button>
              <button
                onClick={handleBookForPassenger}
                className="px-4 sm:px-6 py-3 sm:py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 active:from-green-800 active:to-green-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  'Book for Passenger'
                )}
              </button>
            </div>
          ) : (user?.role?.toLowerCase() === 'admin' || userRole?.toLowerCase() === 'admin') ? (
            <button
              onClick={handleConfirm}
              className="px-4 sm:px-6 py-3 sm:py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                'Confirm (Admin)'
              )}
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="px-4 sm:px-6 py-3 sm:py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 active:from-green-800 active:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;
