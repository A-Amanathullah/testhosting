import React from "react";
import { motion } from "framer-motion";
import { Ticket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TodayBookingCard = () => {
  // Replace with your actual data
  const todayBookings = 38;
  const percentChange = 12.5;
  const isIncrease = percentChange > 0;

  return (
    <Link to="/booking/bus-booking">
      <motion.div 
        className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm cursor-pointer rounded-xl hover:shadow-md"
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-100 p-2.5 rounded-lg">
            <Ticket className="w-6 h-6 text-blue-600" />
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${isIncrease ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isIncrease ? '+' : ''}{percentChange}% vs yesterday
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800">{todayBookings}</h3>
        <p className="mb-4 text-sm text-gray-500">Today's Bookings</p>
        
        <div className="flex items-center justify-end text-sm font-medium text-blue-600">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </motion.div>
    </Link>
  );
};

export default TodayBookingCard;