import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

// Sample data - replace with your actual data
const yearlyData = [
  { name: "2019", bookings: 3200, cancellations: 280 },
  { name: "2020", bookings: 2800, cancellations: 420 },
  { name: "2021", bookings: 3600, cancellations: 340 },
  { name: "2022", bookings: 4100, cancellations: 380 },
  { name: "2023", bookings: 4800, cancellations: 410 },
  { name: "2024", bookings: 5200, cancellations: 460 },
];

const YearwiseBookingChart = () => {
  return (
    <motion.div
      className="w-full p-4 bg-white border border-gray-100 shadow-sm rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Chart with maximized space */}
      <div className="-mx-2 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={yearlyData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
            barGap={16}
            barSize={40} // Extra thick bars since fewer data points
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              dy={10} // Push labels down a bit
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              width={40} // Slightly wider for larger numbers
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#E5E7EB",
                borderRadius: "6px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
              cursor={{ fill: 'rgba(236, 236, 236, 0.5)' }}
              formatter={(value, name) => [`${value} ${name}`, ""]}

              labelStyle={{ color: "#111827", fontWeight: "500" }}
              itemStyle={{ color: "#374151" }}
            />
            <Bar 
              dataKey="bookings" 
              name="Bookings" 
              fill="#8B5CF6" 
              radius={[5, 5, 0, 0]} 
            />
            <Bar 
              dataKey="cancellations" 
              name="Cancellations" 
              fill="#FB923C" 
              radius={[5, 5, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Compact bottom section */}
      <div className="flex flex-col items-center mt-1">
        {/* Indicators with more spacing */}
        <div className="flex items-center mb-2 space-x-12">
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Bookings</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 bg-orange-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Cancellations</span>
          </div>
        </div>
        
        {/* Heading at the bottom */}
        <h2 className="text-lg font-medium text-gray-800">Yearwise Booking & Cancellation</h2>
      </div>
    </motion.div>
  );
};

export default YearwiseBookingChart;