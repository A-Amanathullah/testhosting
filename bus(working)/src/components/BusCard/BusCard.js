import { LuArrowLeftRight } from "react-icons/lu";
import { PiLineVertical } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BusTripCard from "./BusTripCard";
import DatePickerInput from "../../components/Other/DatePickerInput";
import useBusHook from "../../hooks/useBusHook";
// import BusTripForm from "../BusTripForm";


const BusCard = () => {

    const [startDate, setStartDate] = useState(null);


    const { trips, buses, loading, error } = useBusHook();


    const [isSwapped, setIsSwapped] = useState(false);
    const [showBus, setShowBus] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-200">
                <div className="flex space-x-2">
                    <motion.span
                        className="w-4 h-4 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
                    />
                    <motion.span
                        className="w-4 h-4 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.4 }}
                    />
                    <motion.span
                        className="w-4 h-4 bg-primary rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.6 }}
                    />
                </div>
                <p className="mt-4 text-primary text-lg font-semibold">Finding the best trips for you...</p>
            </div>
        );
    }


    if (error) return <div className="p-6 text-red-500">Failed to load trips.</div>;


    const handleSwap = () => {
        setIsSwapped(!isSwapped);
    };


    return (


        <div className='bg-slate-200 min-h-screen'>
            <div className="container bg-slate-200 max-w-6xl mx-auto px-0.5 sm:px-2 lg:px-8">
                <div className='py-0.5 sm:py-1'>
                    <div className="flex flex-col md:flex-row border border-black bg-white gap-0.5 sm:gap-1 items-center p-0.5 sm:p-1 md:p-2 flex-wrap grow shrink rounded-2xl shadow-md">
                        {!isSwapped ? (
                            <div className="flex flex-1 gap-0.5 sm:gap-1 border border-primary transition-all duration-300 rounded-md w-full md:w-auto min-w-[80px] sm:min-w-[120px] md:min-w-[160px]">
                                <input type="text" className="input-form flex-1 transition-all duration-300 rounded-lg text-[10px] sm:text-xs md:text-sm border-none min-w-0 py-0.5 sm:py-1" placeholder="From" />
                                <button className="transition-transform duration-300 active:rotate-180"
                                    onClick={handleSwap}>
                                    <LuArrowLeftRight className="inline-block text-xs sm:text-base md:text-xl" />
                                </button>
                                <input type="text" className="input-form flex-1 transition-all duration-300 rounded-lg text-[10px] sm:text-xs md:text-base border-none min-w-0 py-0.5 sm:py-1" placeholder="To" />
                            </div>
                        ) : (
                            <div className="flex flex-1 gap-0.5 sm:gap-1 border border-primary transition-all duration-300 rounded-md w-full md:w-auto min-w-[80px] sm:min-w-[120px] md:min-w-[160px]">
                                <input type="text" className="input-form flex-1 transition-all duration-300 rounded-lg text-[10px] sm:text-xs md:text-base border-none min-w-0 py-0.5 sm:py-1" placeholder="To" />
                                <button className="transition-transform duration-300 active:rotate-180"
                                    onClick={handleSwap}>
                                    <LuArrowLeftRight className="inline-block text-xs sm:text-base md:text-xl" />
                                </button>
                                <input type="text" className="input-form flex-1 transition-all duration-300 rounded-lg text-[10px] sm:text-xs md:text-sm border-none min-w-0 py-0.5 sm:py-1" placeholder="From" />
                            </div>
                        )}

                        <div className="hidden md:block"><PiLineVertical className="inline-block text-xs sm:text-base md:text-xl opacity-10" /></div>
                        <div className="flex flex-1 gap-0.5 sm:gap-1 border border-primary rounded-md w-full md:w-auto mt-0.5 md:mt-0 min-w-[80px] sm:min-w-[120px] md:min-w-[160px]">
                            <DatePickerInput
                                className="input-form flex justify-self-center rounded-lg text-[10px] sm:text-xs md:text-sm border-none w-full min-w-0 py-0.5 sm:py-1"
                                selectedDate={startDate} setSelectedDate={setStartDate} placeholder="Departure Date" />
                        </div>

                        <div className="flex justify-center w-full md:w-auto mt-0.5 md:mt-0">
                            <button className="bg-primary border border-primary py-0.5 sm:py-1 px-2 sm:px-4 md:px-6 rounded-full hover:bg-transparent duration-200 hover:text-primary text-white w-full md:w-auto min-w-[60px] sm:min-w-[90px] md:min-w-[120px] text-[10px] sm:text-xs md:text-sm"
                                onClick={() => setShowBus((prev) => !prev)}>
                                <div className="flex gap-0.5 sm:gap-1 justify-center items-center">
                                    <FaSearch className="inline-block text-base sm:text-lg md:text-2xl" />
                                    <div className="text-xs sm:text-sm md:text-lg font-semibold"> Search</div>
                                </div>
                            </button>
                        </div>

                    </div>
                    <AnimatePresence mode="wait">
                        {showBus && (
                            <motion.div
                                initial={{ opacity: 0, y: -100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -100 }}
                                transition={{ duration: 0.8 }}
                                className=""
                            >
                                <div className="py-1 sm:py-2">
                                    {trips
                                      .filter(trip => {
                                        // Only show trips with departure_date today or in the future
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const depDate = new Date(trip.departure_date);
                                        depDate.setHours(0, 0, 0, 0);
                                        return depDate >= today;
                                      })
                                      .map((trip) => (
                                        <BusTripCard key={trip.id} trip={trip} buses={buses} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default BusCard;
