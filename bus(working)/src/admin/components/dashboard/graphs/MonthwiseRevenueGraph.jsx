import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

// Sample data - replace with your actual data
const monthlyRevenueData = [
  { name: "Jan", revenue: 42500, target: 40000 },
  { name: "Feb", revenue: 48900, target: 42000 },
  { name: "Mar", revenue: 52100, target: 45000 },
  { name: "Apr", revenue: 58600, target: 48000 },
  { name: "May", revenue: 64200, target: 50000 },
  { name: "Jun", revenue: 71500, target: 55000 },
  { name: "Jul", revenue: 78300, target: 60000 },
  { name: "Aug", revenue: 74800, target: 65000 },
  { name: "Sep", revenue: 82600, target: 70000 },
  { name: "Oct", revenue: 89400, target: 75000 },
  { name: "Nov", revenue: 95700, target: 80000 },
  { name: "Dec", revenue: 102300, target: 85000 },
];

// Calculate total revenue and growth
const totalRevenue = monthlyRevenueData.reduce((sum, month) => sum + month.revenue, 0);
const previousYearRevenue = 750000; // Replace with actual previous year data
const growthPercent = ((totalRevenue - previousYearRevenue) / previousYearRevenue * 100).toFixed(1);

const MonthwiseRevenueGraph = () => {
  return (
    <motion.div
      className="w-full p-4 bg-white border border-gray-100 shadow-sm rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Header with metric */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-2 mr-3 bg-blue-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h3 className="text-xl font-bold text-gray-800">
              ${(totalRevenue / 1000).toFixed(1)}K
              <span className={`ml-2 text-sm font-medium ${
                parseFloat(growthPercent) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {parseFloat(growthPercent) >= 0 ? '+' : ''}{growthPercent}%
              </span>
            </h3>
          </div>
        </div>
      </div>
      
      {/* Chart with maximized space */}
      <div className="-mx-2 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyRevenueData}
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
              tickFormatter={(value) => `$${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#E5E7EB",
                borderRadius: "6px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, ""]}
              labelStyle={{ color: "#111827", fontWeight: "500" }}
              itemStyle={{ color: "#374151" }}
            />
            <ReferenceLine
              y={monthlyRevenueData[0].target}
              stroke="#94A3B8"
              strokeDasharray="3 3"
              label={{
                position: 'right',
                value: 'Target',
                fill: '#94A3B8',
                fontSize: 12,
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 0 }}
              dot={{ strokeWidth: 2, r: 4, stroke: "#3B82F6", fill: "white" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col items-center mt-1">
        <h2 className="text-lg font-medium text-gray-800">Monthwise Revenue</h2>
      </div>
    </motion.div>
  );
};

export default MonthwiseRevenueGraph;