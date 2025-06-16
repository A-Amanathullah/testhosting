import React from "react";
import { motion } from "framer-motion";
import { UserPlus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterAgentCard = () => {
  // Replace with your actual data
  const newAgentsThisMonth = 5;
  const pendingApprovals = 3;

  return (
    <Link to="/users">
      <motion.div 
        className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm cursor-pointer rounded-xl hover:shadow-md"
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-100 p-2.5 rounded-lg">
            <UserPlus className="w-6 h-6 text-green-600" />
          </div>
          <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            {pendingApprovals} pending approvals
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800">{newAgentsThisMonth}</h3>
        <p className="mb-4 text-sm text-gray-500">New Agents This Month</p>
        
        <div className="flex items-center justify-end text-sm font-medium text-green-600">
          <span>Register New Agent</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </motion.div>
    </Link>
  );
};

export default RegisterAgentCard;