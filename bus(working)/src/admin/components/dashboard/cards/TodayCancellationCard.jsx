import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XCircle, /*ArrowRight*/ } from "lucide-react";
import { Link } from "react-router-dom";
import { getTodayCancellations } from "../../../../services/dashboardService";

const TodayCancellationCard = () => {
  const [cancellationData, setCancellationData] = useState({
    count: 0,
    percentChange: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchCancellationData = async () => {
      try {
        setCancellationData(prev => ({ ...prev, loading: true, error: null }));
        const response = await getTodayCancellations();
        
        if (response.success) {
          setCancellationData({
            count: response.data.count,
            percentChange: response.data.percent_change,
            loading: false,
            error: null
          });
        } else {
          throw new Error(response.message || 'Failed to fetch cancellation data');
        }
      } catch (error) {
        console.error("Error fetching cancellation stats:", error);
        setCancellationData({
          count: 0,
          percentChange: 0,
          loading: false,
          error: 'Failed to load data'
        });
      }
    };

    fetchCancellationData();
  }, []);

  const { count, percentChange, loading, error } = cancellationData;
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
            {loading ? 'Loading...' : `${isIncrease ? '+' : ''}${percentChange}% vs yesterday`}
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800">
          {loading ? '...' : error ? 'Error' : count}
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          {error ? error : "Today's Cancellations"}
        </p>
        
        {/* <div className="flex items-center justify-end text-sm font-medium text-red-600">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div> */}
      </motion.div>
    </Link>
  );
};

export default TodayCancellationCard;