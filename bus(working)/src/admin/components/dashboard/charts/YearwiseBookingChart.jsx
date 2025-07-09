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

const YearwiseBookingChart = () => {
  const [yearlyData, setYearlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yearRange, setYearRange] = useState({
    startYear: new Date().getFullYear() - 5,
    endYear: new Date().getFullYear()
  });

  // Load yearly booking data
  useEffect(() => {
    const loadYearlyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookingStatsService.getYearlyStatsWithFallback(
          yearRange.startYear, 
          yearRange.endYear
        );
        setYearlyData(data);
      } catch (err) {
        console.error('Error loading yearly booking data:', err);
        setError('Failed to load yearly booking statistics');
        // Set fallback data
        const fallbackData = [];
        for (let year = yearRange.startYear; year <= yearRange.endYear; year++) {
          fallbackData.push({
            name: year.toString(),
            year: year,
            bookings: 0,
            cancellations: 0,
          });
        }
        setYearlyData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadYearlyData();
  }, [yearRange]);

  // Handle year range change
  const handleYearRangeChange = (field, value) => {
    setYearRange(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  // Generate year options
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(i);
    }
    return years;
  };
  return (
    <motion.div
      className="w-full p-4 bg-white border border-gray-100 shadow-sm rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header with year range selectors */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg font-medium text-gray-800">Yearwise Booking & Cancellation</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">From:</span>
            <select
              value={yearRange.startYear}
              onChange={(e) => handleYearRangeChange('startYear', e.target.value)}
              className="min-w-[80px] px-3 py-2 pr-8 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none cursor-pointer"
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">To:</span>
            <select
              value={yearRange.endYear}
              onChange={(e) => handleYearRangeChange('endYear', e.target.value)}
              className="min-w-[80px] px-3 py-2 pr-8 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none cursor-pointer"
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
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Loading yearly statistics...</span>
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
              className="mt-2 px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
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
                data={yearlyData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 20,
                }}
                barGap={16}
                barSize={40}
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
                  width={40}
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
                <span className="text-sm font-medium text-gray-600">
                  Bookings ({yearlyData.reduce((sum, year) => sum + year.bookings, 0)} total)
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2 bg-orange-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">
                  Cancellations ({yearlyData.reduce((sum, year) => sum + year.cancellations, 0)} total)
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default YearwiseBookingChart;