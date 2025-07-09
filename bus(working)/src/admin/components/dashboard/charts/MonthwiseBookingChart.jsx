import React, { useState, useEffect } from "react";
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
import bookingStatsService from "../../../../services/bookingStatsService";

const MonthwiseBookingChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Load monthly booking data
  useEffect(() => {
    const loadMonthlyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookingStatsService.getMonthlyStatsWithFallback(selectedYear);
        setMonthlyData(data);
      } catch (err) {
        console.error('Error loading monthly booking data:', err);
        setError('Failed to load booking statistics');
        // Set fallback data
        setMonthlyData([
          { name: "Jan", month: 1, bookings: 0, cancellations: 0 },
          { name: "Feb", month: 2, bookings: 0, cancellations: 0 },
          { name: "Mar", month: 3, bookings: 0, cancellations: 0 },
          { name: "Apr", month: 4, bookings: 0, cancellations: 0 },
          { name: "May", month: 5, bookings: 0, cancellations: 0 },
          { name: "Jun", month: 6, bookings: 0, cancellations: 0 },
          { name: "Jul", month: 7, bookings: 0, cancellations: 0 },
          { name: "Aug", month: 8, bookings: 0, cancellations: 0 },
          { name: "Sep", month: 9, bookings: 0, cancellations: 0 },
          { name: "Oct", month: 10, bookings: 0, cancellations: 0 },
          { name: "Nov", month: 11, bookings: 0, cancellations: 0 },
          { name: "Dec", month: 12, bookings: 0, cancellations: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadMonthlyData();
  }, [selectedYear]);

  // Generate year options (current year and previous 2 years)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 3; i++) {
      years.push(currentYear - i);
    }
    return years;
  };
  return (
    <motion.div
      className="w-full p-4 bg-white border border-gray-100 shadow-sm rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Header with year selector */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">Monthwise Booking & Cancellation</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="min-w-[80px] px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em'
          }}
        >
          {getYearOptions().map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading statistics...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex justify-center items-center h-80">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      {!loading && !error && (
        <>
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
                barSize={24}
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
                  width={30}
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
                <span className="text-sm font-medium text-gray-600">
                  Bookings ({monthlyData.reduce((sum, month) => sum + month.bookings, 0)} total)
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 bg-red-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">
                  Cancellations ({monthlyData.reduce((sum, month) => sum + month.cancellations, 0)} total)
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MonthwiseBookingChart;