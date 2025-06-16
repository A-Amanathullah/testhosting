import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

// Generate last 30 days data
const generateDailyRevenueData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Generate random but realistic revenue data
    // Base value plus random variation with weekend boost
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseValue = isWeekend ? 3000 : 2000;
    const variance = Math.random() * 1000;
    
    data.push({
      name: date.getDate().toString(),
      revenue: Math.floor(baseValue + variance),
      // Add the full date for tooltip
      fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }
  
  return data;
};

const dailyRevenueData = generateDailyRevenueData();

// Calculate today's revenue and comparison with yesterday
const todayRevenue = dailyRevenueData[dailyRevenueData.length - 1].revenue;
const yesterdayRevenue = dailyRevenueData[dailyRevenueData.length - 2].revenue;
const changePercent = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1);

const DaywiseRevenueGraph = () => {
  return (
    <motion.div
      className="w-full p-4 bg-white border border-gray-100 shadow-sm rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header with metric */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-2 mr-3 bg-green-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
            <h3 className="text-xl font-bold text-gray-800">
              ${todayRevenue.toLocaleString()}
              <span className={`ml-2 text-sm font-medium ${
                parseFloat(changePercent) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {parseFloat(changePercent) >= 0 ? '+' : ''}{changePercent}%
              </span>
            </h3>
          </div>
        </div>
      </div>
      
      {/* Chart with maximized space */}
      <div className="-mx-2 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dailyRevenueData}
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
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              dy={10}
              interval="preserveStartEnd"
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
              formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
              labelFormatter={(label, items) => {
                const dataItem = items[0]?.payload;
                return dataItem ? dataItem.fullDate : label;
              }}
              labelStyle={{ color: "#111827", fontWeight: "500" }}
              itemStyle={{ color: "#374151" }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10B981"
              fill="url(#colorRevenue)"
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col items-center mt-1">
        <h2 className="text-lg font-medium text-gray-800">30 Days Revenue Trend</h2>
      </div>
    </motion.div>
  );
};

export default DaywiseRevenueGraph;