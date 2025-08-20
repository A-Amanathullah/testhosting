import React from 'react';
import { FaBus, FaArrowRight, FaArrowLeft, FaTimes } from 'react-icons/fa';

const ReturnTripChoiceModal = ({ 
    onClose, 
    onContinueOneWay, 
    onBookReturn, 
    trip, 
    selectedSeats, 
    isFirstTripReturn = false,
    selectedView = "bus" // Add selectedView prop to determine journey type
}) => {
    const getDirectionInfo = () => {
        console.log("=== MODAL DIRECTION INFO DEBUG ===");
        console.log("isFirstTripReturn:", isFirstTripReturn);
        console.log("selectedView:", selectedView);
        console.log("trip.journey_type:", trip.journey_type);
        console.log("trip.start_point:", trip.start_point);
        console.log("trip.end_point:", trip.end_point);
        
        // Determine journey type based on the actual trip's journey_type
        // The trip.journey_type should indicate what type of trip this actually is
        
        if (trip.journey_type === 'return') {
            // Current selection is a return journey trip
            console.log("Detected as RETURN journey (based on trip.journey_type)");
            return {
                currentDirection: 'Return',
                currentRoute: `${trip.start_point} → ${trip.end_point}`,
                otherDirection: 'Outbound',
                otherRoute: `${trip.end_point} → ${trip.start_point}`,
                icon: <FaArrowLeft className="text-green-600" />
            };
        } else {
            // Current selection is an outbound journey trip  
            console.log("Detected as OUTBOUND journey (based on trip.journey_type)");
            return {
                currentDirection: 'Outbound',
                currentRoute: `${trip.start_point} → ${trip.end_point}`,
                otherDirection: 'Return',
                otherRoute: `${trip.end_point} → ${trip.start_point}`,
                icon: <FaArrowRight className="text-blue-600" />
            };
        }
    };

    const directionInfo = getDirectionInfo();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <FaBus className="text-2xl" />
                        <h2 className="text-2xl font-bold">Complete Your Journey</h2>
                    </div>
                    <p className="text-blue-100">Choose your booking preference</p>
                </div>

                {/* Current Selection Summary */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Selection</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {directionInfo.icon}
                                <span className="font-medium text-gray-700">
                                    {directionInfo.currentDirection} Journey
                                </span>
                            </div>
                            <span className="text-sm font-medium text-blue-600">
                                Bus {trip.bus_no}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                            Route: {directionInfo.currentRoute}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                            Seats: {selectedSeats.join(', ')}
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                            Amount: Rs. {(Number(trip.price) * selectedSeats.length).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">What would you like to do?</h3>
                    
                    {/* Option 1: Book Return Trip */}
                    <button
                        onClick={onBookReturn}
                        className="w-full mb-4 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-left group"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <FaBus className="text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">
                                    Book {directionInfo.otherDirection} Journey Also
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Complete your round trip
                                </p>
                            </div>
                        </div>
                        <div className="ml-13 text-sm text-gray-500">
                            Route: {directionInfo.otherRoute}
                        </div>
                        <div className="ml-13 mt-1 text-xs text-blue-600 font-medium">
                            Choose seats for your {directionInfo.otherDirection.toLowerCase()} journey →
                        </div>
                    </button>

                    {/* Option 2: Continue One Way */}
                    <button
                        onClick={onContinueOneWay}
                        className="w-full p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 text-left group"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <FaArrowRight className="text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Continue with One Way Only</h4>
                                <p className="text-sm text-gray-600">
                                    Proceed with current selection
                                </p>
                            </div>
                        </div>
                        <div className="ml-13 text-xs text-green-600 font-medium">
                            Proceed to payment →
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 text-center">
                    <p className="text-xs text-gray-500">
                        You can always book your return journey separately later
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReturnTripChoiceModal;
