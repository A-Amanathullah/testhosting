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

const CurrentMonthBookingChart = () => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1 // JS months are 0-indexed
  });
  const [monthName, setMonthName] = useState('');

  // Load daily booking data
  useEffect(() => {
    const loadDailyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await bookingStatsService.getDailyStatsWithFallback(
          selectedDate.year, 
          selectedDate.month
        );
        setDailyData(result.data);
        setMonthName(result.monthName);
      } catch (err) {
        console.error('Error loading daily booking data:', err);
        setError('Failed to load daily booking statistics');
        // Set fallback data
        setDailyData([]);
        setMonthName(new Date().toLocaleString('default', { month: 'long' }));
      } finally {
        setLoading(false);
      }
    };

    loadDailyData();
  }, [selectedDate]);

  // Handle date change
  const handleDateChange = (field, value) => {
    setSelectedDate(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  // Generate month/year options
  const getMonthOptions = () => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      const monthName = new Date(2000, i - 1, 1).toLocaleString('default', { month: 'long' });
      months.push({ value: i, name: monthName });
    }
    return months;
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 3; i--) {
      years.push(i);
    }
    return years;
  };
  return (
    <motion.div
      className="w-full p-4 bg-white border border-gray-100 shadow-sm rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header with month/year selectors */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg font-medium text-gray-800">{monthName} Booking & Cancellation</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedDate.month}
            onChange={(e) => handleDateChange('month', e.target.value)}
            className="min-w-[100px] px-3 py-2 pr-8 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            {getMonthOptions().map(month => (
              <option key={month.value} value={month.value}>{month.name}</option>
            ))}
          </select>
          <select
            value={selectedDate.year}
            onChange={(e) => handleDateChange('year', e.target.value)}
            className="min-w-[80px] px-3 py-2 pr-8 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none cursor-pointer"
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
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Loading daily statistics...</span>
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
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
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
                data={dailyData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 20,
                }}
                barGap={2}
                barSize={6}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={{ stroke: '#E5E7EB' }}
                  interval="preserveStartEnd"
                  dy={10}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={{ stroke: '#E5E7EB' }}
                  width={25}
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
            {/* Indicators with totals */}
            <div className="flex items-center mb-2 space-x-12">
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">
                  Bookings ({dailyData.reduce((sum, day) => sum + day.bookings, 0)} total)
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 rounded-full bg-amber-400"></div>
                <span className="text-sm font-medium text-gray-600">
                  Cancellations ({dailyData.reduce((sum, day) => sum + day.cancellations, 0)} total)
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CurrentMonthBookingChart;