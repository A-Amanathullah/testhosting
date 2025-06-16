import { useLocation, } from "react-router-dom";
import { FaCaretRight } from "react-icons/fa";
import { TbAirConditioning } from "react-icons/tb";
import { FaPersonThroughWindow } from "react-icons/fa6";
import { MdAirlineSeatReclineExtra } from "react-icons/md";
import { PiSeatFill } from "react-icons/pi";

const SelectedCard = () => {

    const location = useLocation();
    const trip = location.state?.trip;

    if (!trip) {
        return (
            <div className="container pt-7">
                <div className="bg-white rounded-3xl shadow-xl p-8 text-center text-gray-500">
                    No trip selected.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container pt-1 sm:pt-3">
                <div className="bg-white rounded-2xl shadow-xl">
                    <div className="bg-blue-600 rounded-t-2xl p-1 sm:p-2 px-1 sm:px-2 flex flex-col sm:flex-row justify-between text-white text-xs sm:text-sm font-medium text-center sm:text-left">
                        <span className="w-full sm:w-auto">RS Express {trip.bus_no}</span>
                        <span className="w-full sm:w-auto">{trip.departure_time}</span>
                    </div>
                    <div className="bg-primary h-1"></div>
                    <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-2 sm:gap-1 md:gap-0">
                        <div className="p-1 w-full md:w-1/5 text-center md:text-left">
                            <span className="text-gray-600 text-xs">Departure</span>
                            <div className="font-bold text-xs">{trip.start_point}</div>
                            <div className="text-xs">Date: <span className="font-bold">{trip.departure_date}</span></div>
                            <div className="text-xs">Time: <span className="font-bold">{trip.departure_time}</span></div>
                        </div>
                        <div className="flex flex-col justify-center items-center p-1 sm:p-2 w-full md:w-1/5">
                            <div className="text-primary text-2xl sm:text-4xl md:text-6xl">
                                <FaCaretRight className="justify-self-center" />
                            </div>
                            <div className="text-xs">Duration: {trip.duration}</div>
                        </div>
                        <div className="p-1 sm:p-2 w-full md:w-1/5 text-center md:text-left">
                            <span className="text-gray-600 text-xs">Arrival</span>
                            <div className="font-bold text-xs">{trip.end_point}</div>
                            <div className="text-xs">Date: <span className="font-bold">{trip.arrival_date}</span></div>
                            <div className="text-xs">Time: <span className="font-bold">{trip.arrival_time}</span></div>
                        </div>
                        <div className="p-1 sm:p-2 w-full md:w-1/5 text-center md:text-left">
                            <div className="flex flex-wrap items-center gap-1 font-bold text-[10px] sm:text-xs md:text-base text-primary mb-1 justify-center md:justify-start">
                                <TbAirConditioning /> Air Conditioned
                                <FaPersonThroughWindow /> Large Windows
                                <MdAirlineSeatReclineExtra /> Footrest Seats
                                <PiSeatFill /> Adjustable Seats
                            </div>
                        </div>
                        <div className="p-1 sm:p-2 w-full md:w-1/5 text-center md:text-left">
                            <div className="text-blue-900 text-base font-bold py-1">Rs. {trip.price}</div>
                            <div className="flex items-center gap-1 text-xs mt-1 py-1 justify-center md:justify-start">
                                <span>Available Seats</span>
                                <span className="bg-orange-500 text-white px-1 rounded py-1">{trip.available_seats}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 text-white flex flex-col sm:flex-row justify-evenly rounded-b-2xl p-1 sm:p-2 text-xs gap-1 text-center">
                        <span>Closing:</span>
                        <span>{trip.departure_date}</span>
                        <span>02:00 PM</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SelectedCard;