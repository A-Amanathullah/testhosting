import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { getYearlyRevenue } from "../../../../services/dashboardService";

const YearwiseRevenueGraph = () => {
  const [revenueData, setRevenueData] = useState({
    yearlyData: [],
    currentYearRevenue: 0,
    previousYearRevenue: 0,
    growthPercent: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchYearlyRevenue = async () => {
      try {
        setRevenueData(prev => ({ ...prev, loading: true, error: null }));
        const response = await getYearlyRevenue();
        
        if (response.success) {
          setRevenueData({
            yearlyData: response.data.yearly_data,
            currentYearRevenue: response.data.current_year_revenue,
            previousYearRevenue: response.data.previous_year_revenue,
            growthPercent: response.data.growth_percent,
            loading: false,
            error: null
          });
        } else {
          throw new Error(response.message || 'Failed to fetch yearly revenue data');
        }
      } catch (error) {
        console.error("Error fetching yearly revenue:", error);
        setRevenueData({
          yearlyData: [],
          currentYearRevenue: 0,
          previousYearRevenue: 0,
          growthPercent: 0,
          loading: false,
          error: 'Failed to load revenue data'
        });
      }
    };

    fetchYearlyRevenue();
  }, []);

  const { yearlyData, currentYearRevenue, growthPercent, loading, error } = revenueData;
  return (
    <motion.div
      className="w-full p-4 bg-white border border-gray-100 shadow-sm rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header with metric */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-2 mr-3 bg-purple-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{new Date().getFullYear()} Projected</p>
            <h3 className="text-xl font-bold text-gray-800">
              {loading ? (
                'Loading...'
              ) : error ? (
                'Error'
              ) : (
                <>
                  Rs.{(currentYearRevenue / 1000000).toFixed(1)}M
                  <span className={`ml-2 text-sm font-medium ${
                    growthPercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {growthPercent >= 0 ? '+' : ''}{growthPercent}%
                  </span>
                </>
              )}
            </h3>
          </div>
        </div>
      </div>
      
      {/* Chart with maximized space */}
      <div className="-mx-2 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={loading ? [] : yearlyData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              width={45}
              tickFormatter={(value) => `Rs.${value / 1000000}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#E5E7EB",
                borderRadius: "6px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [`Rs.${value.toLocaleString()}`, ""]}
              labelStyle={{ color: "#111827", fontWeight: "500" }}
              itemStyle={{ color: "#374151" }}
            />
            {/* Remove ReferenceLine since we don't have target data */}
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 0 }}
              dot={{ strokeWidth: 2, r: 4, stroke: "#8B5CF6", fill: "white" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom section - simplified to match MonthwiseRevenueGraph */}
      <div className="flex flex-col items-center mt-1">
        <h2 className="text-lg font-medium text-gray-800">Annual Revenue Trend</h2>
      </div>
    </motion.div>
  );
};

export default YearwiseRevenueGraph;