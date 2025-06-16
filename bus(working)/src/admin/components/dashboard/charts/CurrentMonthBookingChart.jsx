import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

// Generate current month data (days 1-30/31)
const generateCurrentMonthData = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const data = [];
  for (let day = 1; day <= daysInMonth; day++) {
    // Generate some sample data - replace with actual data
    const dayDate = new Date(year, month, day);
    // Only include days up to today
    if (dayDate <= currentDate) {
      // Random but somewhat realistic data
      const bookings = Math.floor(Math.random() * 20) + 5;
      const cancellations = Math.floor(Math.random() * 5);
      
      data.push({
        name: day.toString(),
        bookings,
        cancellations,
      });
    }
  }
  
  return data;
};

const currentMonthData = generateCurrentMonthData();

// Get month name for display
const monthName = new Date().toLocaleString('default', { month: 'long' });

const CurrentMonthBookingChart = () => {
  return (
    <motion.div
      className="w-full p-4 bg-white border border-gray-100 shadow-sm rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Chart with maximized space */}
      <div className="-mx-2 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentMonthData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
            barGap={2}
            barSize={6} // Thinner bars due to many data points
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              interval="preserveStartEnd"
              dy={10} // Push labels down a bit
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              width={25} // Narrow width to save space
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

              labelFormatter={(label) => `Day ${label}, ${monthName}`}
              labelStyle={{ color: "#111827", fontWeight: "500" }}
              itemStyle={{ color: "#374151" }}
            />
            <Bar 
              dataKey="bookings" 
              name="Bookings" 
              fill="#10B981" 
              radius={[3, 3, 0, 0]} 
            />
            <Bar 
              dataKey="cancellations" 
              name="Cancellations" 
              fill="#F59E0B" 
              radius={[3, 3, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Compact bottom section */}
      <div className="flex flex-col items-center mt-1">
        {/* Indicators with more spacing */}
        <div className="flex items-center mb-2 space-x-12">
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Bookings</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 rounded-full bg-amber-400"></div>
            <span className="text-sm font-medium text-gray-600">Cancellations</span>
          </div>
        </div>
        
        {/* Heading at the bottom */}
        <h2 className="text-lg font-medium text-gray-800">{monthName} Booking & Cancellation</h2>
      </div>
    </motion.div>
  );
};

export default CurrentMonthBookingChart;