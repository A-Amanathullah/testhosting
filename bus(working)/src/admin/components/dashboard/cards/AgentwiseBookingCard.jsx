import React from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AgentwiseBookingCard = () => {
  // Replace with your actual data
  const topAgentName = "Arafat Travel";
  const topAgentBookings = 143;
  const totalAgents = 24;

  return (
    <Link to="/report/agent">
      <motion.div 
        className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm cursor-pointer rounded-xl hover:shadow-md"
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-100 p-2.5 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {totalAgents} total agents
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800">{topAgentName}</h3>
        <p className="mb-4 text-sm text-gray-500">Top Agent • {topAgentBookings} bookings</p>
        
        <div className="flex items-center justify-end text-sm font-medium text-purple-600">
          <span>View All Agents</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </motion.div>
    </Link>
  );
};

export default AgentwiseBookingCard;