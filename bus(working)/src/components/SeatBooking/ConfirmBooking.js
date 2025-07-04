import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ConfirmBooking = ({ selectedSeats, onClose, onConfirm, trip, onAgentBookForPassenger, isLoading = false }) => {
  const { user } = useContext(AuthContext);
  const seatPrice = trip?.price || 0; // Use trip price if available, otherwise default to 0
  const totalAmount = selectedSeats.length * seatPrice;

  const handleConfirm = () => {
    onConfirm();
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Animation state
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 50); // trigger fade-in animation
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg w-11/12 sm:w-2/3 md:w-2/5 p-2 transition-all duration-300 transform ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h2 className="text-lg font-bold text-center text-primary mb-2">Booking Summary</h2>

        <div className="overflow-x-auto">
        <div className="max-h-[40vh] sm:max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left border border-gray-200 text-xs">
            <thead className="bg-gray-100 text-xs sticky top-0 z-10">
              <tr>
                <th className="border-b px-2 py-1">Seat No</th>
                <th className="border-b px-2 py-1">Price (Rs)</th>
                <th className="border-b px-2 py-1">Date</th>
              </tr>
            </thead>
            <tbody>
              {selectedSeats.map((seat, index) => (
                <tr key={index} className="text-gray-700 text-xs">
                  <td className="border-b px-2 py-1">{seat}</td>
                  <td className="border-b px-2 py-1">{seatPrice.toLocaleString()}</td>
                  <td className="border-b px-2 py-1">{today}</td>
                </tr>
              ))}
              <tr className="font-bold text-xs bg-primary/50 ">
                <td className="px-2 py-1">Total</td>
                <td className="px-2 py-1">Rs. {totalAmount.toLocaleString()}</td>
                <td className="px-2 py-1"></td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row justify-end gap-1">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Cancel Booking
          </button>
          
          {user?.role === 'agent' ? (
            <div className="flex flex-col sm:flex-row gap-1">
              <button
                onClick={onConfirm}
                className="w-full sm:w-auto px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm (Agent)"}
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onAgentBookForPassenger) onAgentBookForPassenger();
                }}
                className="w-full sm:w-auto px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Book for Passenger"}
              </button>
            </div>
          ) : user?.role === 'admin' ? (
            <button
              onClick={handleConfirm}
              className="w-full sm:w-auto px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm (Admin)"}
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="w-full sm:w-auto px-2 py-1 bg-primary/70 text-white rounded hover:bg-primary transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;
