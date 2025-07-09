// API Base URL Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const bookingStatsService = {
    /**
     * Get monthly booking and cancellation statistics
     */
    async getMonthlyStats(year = new Date().getFullYear()) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/booking-stats/monthly?year=${year}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch monthly statistics');
            }
        } catch (error) {
            console.error('Error fetching monthly booking stats:', error);
            throw error;
        }
    },

    /**
     * Get booking summary statistics
     */
    async getBookingSummary(year = new Date().getFullYear()) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/booking-stats/summary?year=${year}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch booking summary');
            }
        } catch (error) {
            console.error('Error fetching booking summary:', error);
            throw error;
        }
    },

    /**
     * Get monthly stats with fallback to sample data
     */
    async getMonthlyStatsWithFallback(year = new Date().getFullYear()) {
        try {
            return await this.getMonthlyStats(year);
        } catch (error) {
            console.warn('Using fallback data for monthly stats:', error);
            // Return sample data as fallback
            return [
                { name: "Jan", month: 1, bookings: 150, cancellations: 12 },
                { name: "Feb", month: 2, bookings: 165, cancellations: 15 },
                { name: "Mar", month: 3, bookings: 180, cancellations: 18 },
                { name: "Apr", month: 4, bookings: 210, cancellations: 22 },
                { name: "May", month: 5, bookings: 245, cancellations: 19 },
                { name: "Jun", month: 6, bookings: 270, cancellations: 25 },
                { name: "Jul", month: 7, bookings: 310, cancellations: 30 },
                { name: "Aug", month: 8, bookings: 290, cancellations: 28 },
                { name: "Sep", month: 9, bookings: 320, cancellations: 32 },
                { name: "Oct", month: 10, bookings: 350, cancellations: 27 },
                { name: "Nov", month: 11, bookings: 370, cancellations: 35 },
                { name: "Dec", month: 12, bookings: 390, cancellations: 38 },
            ];
        }
    },

    /**
     * Get yearly booking and cancellation statistics
     */
    async getYearlyStats(startYear = new Date().getFullYear() - 5, endYear = new Date().getFullYear()) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/booking-stats/yearly?start_year=${startYear}&end_year=${endYear}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch yearly statistics');
            }
        } catch (error) {
            console.error('Error fetching yearly booking stats:', error);
            throw error;
        }
    },

    /**
     * Get yearly stats with fallback to sample data
     */
    async getYearlyStatsWithFallback(startYear = new Date().getFullYear() - 5, endYear = new Date().getFullYear()) {
        try {
            return await this.getYearlyStats(startYear, endYear);
        } catch (error) {
            console.warn('Using fallback data for yearly stats:', error);
            // Return sample data as fallback
            const fallbackData = [];
            for (let year = startYear; year <= endYear; year++) {
                fallbackData.push({
                    name: year.toString(),
                    year: year,
                    bookings: Math.floor(Math.random() * 2000) + 3000, // Random between 3000-5000
                    cancellations: Math.floor(Math.random() * 200) + 250, // Random between 250-450
                });
            }
            return fallbackData;
        }
    },

    /**
     * Get daily booking and cancellation statistics
     */
    async getDailyStats(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/booking-stats/daily?year=${year}&month=${month}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return {
                    data: data.data,
                    monthName: data.month_name,
                    year: data.year,
                    month: data.month
                };
            } else {
                throw new Error(data.message || 'Failed to fetch daily statistics');
            }
        } catch (error) {
            console.error('Error fetching daily booking stats:', error);
            throw error;
        }
    },

    /**
     * Get daily stats with fallback to sample data
     */
    async getDailyStatsWithFallback(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
        try {
            return await this.getDailyStats(year, month);
        } catch (error) {
            console.warn('Using fallback data for daily stats:', error);
            
            // Generate fallback data for current month
            const currentDate = new Date(year, month - 1); // month is 0-indexed in JS
            const daysInMonth = new Date(year, month, 0).getDate();
            const today = new Date();
            const isCurrentMonth = (year === today.getFullYear() && month === (today.getMonth() + 1));
            const maxDay = isCurrentMonth ? today.getDate() : daysInMonth;
            
            const fallbackData = [];
            for (let day = 1; day <= maxDay; day++) {
                fallbackData.push({
                    name: day.toString(),
                    day: day,
                    bookings: Math.floor(Math.random() * 20) + 5, // Random between 5-25
                    cancellations: Math.floor(Math.random() * 5), // Random between 0-5
                });
            }
            
            const monthName = currentDate.toLocaleString('default', { month: 'long' });
            
            return {
                data: fallbackData,
                monthName: monthName,
                year: year,
                month: month
            };
        }
    },
};

export default bookingStatsService;
