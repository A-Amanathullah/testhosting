import React from "react";
import { motion } from "framer-motion";
import { XCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TodayCancellationCard = () => {
  // Replace with your actual data
  const todayCancellations = 7;
  const percentChange = -3.2;
  const isIncrease = percentChange > 0;

  return (
    <Link to="/report/cancellation">
      <motion.div 
        className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm cursor-pointer rounded-xl hover:shadow-md"
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="bg-red-100 p-2.5 rounded-lg">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${isIncrease ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {isIncrease ? '+' : ''}{percentChange}% vs yesterday
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800">{todayCancellations}</h3>
        <p className="mb-4 text-sm text-gray-500">Today's Cancellations</p>
        
        <div className="flex items-center justify-end text-sm font-medium text-red-600">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </motion.div>
    </Link>
  );
};

export default TodayCancellationCard;