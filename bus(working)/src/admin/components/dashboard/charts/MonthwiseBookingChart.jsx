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
const monthlyData = [
  { name: "Jan", bookings: 150, cancellations: 12 },
  { name: "Feb", bookings: 165, cancellations: 15 },
  { name: "Mar", bookings: 180, cancellations: 18 },
  { name: "Apr", bookings: 210, cancellations: 22 },
  { name: "May", bookings: 245, cancellations: 19 },
  { name: "Jun", bookings: 270, cancellations: 25 },
  { name: "Jul", bookings: 310, cancellations: 30 },
  { name: "Aug", bookings: 290, cancellations: 28 },
  { name: "Sep", bookings: 320, cancellations: 32 },
  { name: "Oct", bookings: 350, cancellations: 27 },
  { name: "Nov", bookings: 370, cancellations: 35 },
  { name: "Dec", bookings: 390, cancellations: 38 },
];

const MonthwiseBookingChart = () => {
  return (
    <motion.div
      className="w-full p-4 bg-white border border-gray-100 shadow-sm rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Chart with maximized space */}
      <div className="-mx-2 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
            barGap={12}
            barSize={24} // Even thicker bars
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
              width={30} // Reduce YAxis width
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
              fill="#3B82F6" 
              radius={[5, 5, 0, 0]} 
            />
            <Bar 
              dataKey="cancellations" 
              name="Cancellations" 
              fill="#F87171" 
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
            <div className="w-5 h-5 mr-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Bookings</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 bg-red-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Cancellations</span>
          </div>
        </div>
        
        {/* Heading at the bottom */}
        <h2 className="text-lg font-medium text-gray-800">Monthwise Booking & Cancellation</h2>
      </div>
    </motion.div>
  );
};

export default MonthwiseBookingChart;