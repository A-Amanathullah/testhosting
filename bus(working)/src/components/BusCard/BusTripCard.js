// BusTripCard.jsx
import { FaCaretRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";



const BusTripCard = ({ trip, buses, searchParams }) => {



  const busInfo = buses.find(bus => bus.bus_no === trip.bus_no);

  // Format date from ISO string to user-friendly format (DD MMM YYYY)
  // Note: With backend changes, dates may already be formatted
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Check if date is already formatted (contains spaces, e.g., "10 Jul 2025")
    if (typeof dateString === 'string' && dateString.includes(' ')) {
      return dateString; // Already formatted
    }

    try {
      // Check if it's an ISO string (with T and Z)
      const isISO = typeof dateString === 'string' && dateString.includes('T');
      const date = isISO ? parseISO(dateString) : new Date(dateString);
      return format(date, 'dd MMM yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if parsing fails
    }
  };

  // Use route-based information if available, otherwise use trip defaults
  const startPoint = trip.actual_start_point || trip.start_point;
  const endPoint = trip.actual_end_point || trip.end_point;
  const departureTime = trip.actual_departure_time || trip.departure_time;
  const arrivalTime = trip.actual_arrival_time || trip.arrival_time;
  const journeyPrice = trip.journey_fare || trip.price;

  // Format duration properly
  let journeyDuration = trip.duration;
  // if (trip.journey_duration) {
  //   // journey_duration comes as "X minutes" from backend
  //   const minutes = parseInt(trip.journey_duration.replace(' minutes', ''));
  //   const hours = Math.floor(minutes / 60);
  //   const remainingMinutes = minutes % 60;
  //   journeyDuration = `${hours}h ${remainingMinutes}m`;
  // }
  return (

    <div className="bg-white rounded-3xl mb-4 sm:mb-6">
      <div className="bg-blue-600 rounded-t-3xl p-2 sm:p-3 flex flex-col sm:flex-row justify-between text-white text-base sm:text-lg font-medium">
        <span>Stops @ {startPoint}</span>
        <span>Bus No {trip.bus_no}</span>
      </div>
      <div className="bg-primary h-1.5 sm:h-2"></div>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-1 sm:gap-2 lg:gap-0">
        <div className="p-1 sm:p-2 flex-shrink-0 flex justify-center w-full lg:w-auto">
          <img src={busInfo?.image ? `http://localhost:8000/storage/${busInfo.image}` : '/placeholder.jpg'} alt="Bus" className="max-w-full w-28 h-20 sm:w-44 sm:h-32 object-cover border mb-1 sm:mb-2 rounded-lg" />
        </div>
        <div className="p-1 w-full lg:w-auto text-center lg:text-left text-xs sm:text-sm">
          <span className="text-gray-600">Departure</span>
          <div className="font-bold">{startPoint}</div>
          <div className="text-gray-600">Date: <span className="font-bold">{formatDate(trip.departure_date)}</span></div>
          <div className="text-gray-600">Time: <span className="font-bold">{departureTime}</span></div>
        </div>
        <div className="flex flex-col justify-center items-center p-2 sm:p-5 w-full lg:w-auto">
          <div className="text-primary text-4xl sm:text-6xl md:text-8xl">
            <FaCaretRight />
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">Duration: {journeyDuration}</div>
        </div>
        <div className="p-2 sm:p-5 w-full lg:w-auto text-center lg:text-left text-xs sm:text-sm">
          <span className="text-gray-600">Arrival</span>
          <div className="font-bold">{endPoint}</div>
          <div className="text-gray-600">Date: <span className="font-bold">{formatDate(trip.arrival_date)}</span></div>
          <div className="text-gray-600">Time: <span className="font-bold">{arrivalTime}</span></div>
        </div>
        <div className="p-2 sm:p-5 w-full lg:w-auto text-center lg:text-left text-xs sm:text-sm">
          <div><span className="text-gray-600">Booking Closing Date</span>: <span className="font-bold">{formatDate(trip.departure_date)}</span></div>
          <div><span className="text-gray-600">Booking Closing Time</span>: <span className="font-bold">02:00 PM</span></div>
          <div><span className="text-gray-600">Depot Name</span>: <span className="font-bold">{startPoint}</span></div>
        </div>
        <div className="p-4 sm:p-8 w-full lg:w-auto text-center lg:text-left">
          <div className="text-blue-900 text-lg sm:text-2xl font-bold py-1 sm:py-2">Rs.{journeyPrice}</div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm mt-1 py-1 sm:py-2 justify-center lg:justify-start">
            <span>Available Seats</span>
            <span className={`px-1 sm:px-2 rounded py-1 sm:py-2 ${trip.available_seats === 0 ? 'bg-red-600' : 'bg-orange-500'} text-white`}>
              {trip.available_seats === 0 ? "All Sold" : trip.available_seats}
            </span>
          </div>

          {trip.available_seats > 0 ? (
            <Link to="/seatPlan"
              state={{ 
                trip, 
                isReturn: searchParams?.isReturn, 
                selectedView: searchParams?.selectedView,
                isSecondLeg: searchParams?.isSecondLeg,
                firstTripBooking: searchParams?.firstTripBooking,
                searchParams: searchParams // Pass the full search parameters including returnDate
              }}>
              <button className="bg-orange-500 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded mt-1 sm:mt-2 w-full lg:w-auto text-xs sm:text-base">Book seat</button>
            </Link>
          ) : (
            <div>
              <button
                className="bg-gray-400 text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded mt-1 sm:mt-2 cursor-not-allowed w-full lg:w-auto text-xs sm:text-base animate-[blinkbg_2s_linear_infinite]"
                disabled
              >
                Book seat
              </button>
              <style>
                {`
                  @keyframes blinkbg {
                    0%, 50% { background-color: #ef4444; } /* red-500 */
                    50%, 100% { background-color: #3b82f6; } /* blue-500 */
                  }
                `}
              </style>
            </div>

          )}

        </div>
      </div>
      <div className="bg-slate-900 text-white text-right rounded-b-3xl p-2 sm:p-4 text-[10px] sm:text-xs md:text-base">Boarding / Dropping Points</div>
    </div>
  );
};

export default BusTripCard;
