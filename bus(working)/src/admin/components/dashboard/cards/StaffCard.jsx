import React from "react";
import { motion } from "framer-motion";
import { UserCog, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const StaffCard = () => {
  // Replace with your actual data
  const totalStaff = 16;
  const onlineNow = 8;

  return (
    <Link to="/staff/list">
      <motion.div 
        className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm cursor-pointer rounded-xl hover:shadow-md"
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="bg-orange-100 p-2.5 rounded-lg">
            <UserCog className="w-6 h-6 text-orange-600" />
          </div>
          <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {onlineNow} online now
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800">{totalStaff}</h3>
        <p className="mb-4 text-sm text-gray-500">Staff Members</p>
        
        <div className="flex items-center justify-end text-sm font-medium text-orange-600">
          <span>Manage Staff</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </motion.div>
    </Link>
  );
};

export default StaffCard;