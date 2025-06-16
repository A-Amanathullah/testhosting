import React from "react";
import { motion } from "framer-motion";
import { Smartphone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const WebAppUserCard = () => {
  // Replace with your actual data
  const totalUsers = 2486;
  const activeToday = 342;

  return (
    <Link to="/users">
      <motion.div 
        className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm cursor-pointer rounded-xl hover:shadow-md"
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="bg-indigo-100 p-2.5 rounded-lg">
            <Smartphone className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {activeToday} active today
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800">{totalUsers.toLocaleString()}</h3>
        <p className="mb-4 text-sm text-gray-500">Total Web & App Users</p>
        
        <div className="flex items-center justify-end text-sm font-medium text-indigo-600">
          <span>View User Analytics</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </motion.div>
    </Link>
  );
};

export default WebAppUserCard;