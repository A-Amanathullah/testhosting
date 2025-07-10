import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCog, /*ArrowRight*/ } from "lucide-react";
import { Link } from "react-router-dom";
import { getStaffStats } from "../../../../services/dashboardService";

const StaffCard = () => {
  const [staffData, setStaffData] = useState({
    totalStaff: 0,
    onlineNow: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setStaffData(prev => ({ ...prev, loading: true, error: null }));
        const response = await getStaffStats();
        
        if (response.success) {
          setStaffData({
            totalStaff: response.data.total_staff,
            onlineNow: response.data.online_now,
            loading: false,
            error: null
          });
        } else {
          throw new Error(response.message || 'Failed to fetch staff data');
        }
      } catch (error) {
        console.error("Error fetching staff stats:", error);
        setStaffData({
          totalStaff: 0,
          onlineNow: 0,
          loading: false,
          error: 'Failed to load data'
        });
      }
    };

    fetchStaffData();
  }, []);

  const { totalStaff, onlineNow, loading, error } = staffData;

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
            {loading ? 'Loading...' : `${onlineNow} online now`}
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800">
          {loading ? '...' : error ? 'Error' : totalStaff}
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          {error ? error : "Staff Members"}
        </p>
        
        {/* <div className="flex items-center justify-end text-sm font-medium text-orange-600">
          <span>Manage Staff</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div> */}
      </motion.div>
    </Link>
  );
};

export default StaffCard;