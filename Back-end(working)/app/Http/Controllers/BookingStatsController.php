<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\GuestBooking;
use App\Models\Cancellation;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingStatsController extends Controller
{
    /**
     * Get monthly booking and cancellation statistics
     */
    public function getMonthlyStats(Request $request)
    {
        try {
            $year = $request->get('year', Carbon::now()->year);
            
            // Get monthly booking counts (combining bookings and guest_bookings)
            $bookingStats = DB::select("
                SELECT 
                    MONTH(created_at) as month,
                    COUNT(*) as count
                FROM (
                    SELECT created_at FROM bookings WHERE YEAR(created_at) = ? AND status != 'cancelled'
                    UNION ALL
                    SELECT created_at FROM guest_bookings WHERE YEAR(created_at) = ? AND status != 'cancelled'
                ) as combined_bookings
                GROUP BY MONTH(created_at)
                ORDER BY month
            ", [$year, $year]);

            // Get monthly cancellation counts
            $cancellationStats = DB::select("
                SELECT 
                    MONTH(created_at) as month,
                    COUNT(*) as count
                FROM cancellations 
                WHERE YEAR(created_at) = ?
                GROUP BY MONTH(created_at)
                ORDER BY month
            ", [$year]);

            // Create arrays indexed by month
            $bookingsByMonth = [];
            $cancellationsByMonth = [];

            foreach ($bookingStats as $stat) {
                $bookingsByMonth[$stat->month] = $stat->count;
            }

            foreach ($cancellationStats as $stat) {
                $cancellationsByMonth[$stat->month] = $stat->count;
            }

            // Generate data for all 12 months
            $monthlyData = [];
            $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            for ($month = 1; $month <= 12; $month++) {
                $monthlyData[] = [
                    'name' => $monthNames[$month - 1],
                    'month' => $month,
                    'bookings' => $bookingsByMonth[$month] ?? 0,
                    'cancellations' => $cancellationsByMonth[$month] ?? 0,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $monthlyData,
                'year' => $year,
                'message' => 'Monthly statistics retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving monthly statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get overall booking statistics summary
     */
    public function getBookingSummary(Request $request)
    {
        try {
            $year = $request->get('year', Carbon::now()->year);

            // Total bookings for the year
            $totalBookings = DB::select("
                SELECT COUNT(*) as total FROM (
                    SELECT id FROM bookings WHERE YEAR(created_at) = ? AND status != 'cancelled'
                    UNION ALL
                    SELECT id FROM guest_bookings WHERE YEAR(created_at) = ? AND status != 'cancelled'
                ) as combined_bookings
            ", [$year, $year])[0]->total;

            // Total cancellations for the year
            $totalCancellations = Cancellation::whereYear('created_at', $year)->count();

            // Current month bookings
            $currentMonthBookings = DB::select("
                SELECT COUNT(*) as total FROM (
                    SELECT id FROM bookings WHERE YEAR(created_at) = ? AND MONTH(created_at) = ? AND status != 'cancelled'
                    UNION ALL
                    SELECT id FROM guest_bookings WHERE YEAR(created_at) = ? AND MONTH(created_at) = ? AND status != 'cancelled'
                ) as combined_bookings
            ", [$year, Carbon::now()->month, $year, Carbon::now()->month])[0]->total;

            // Current month cancellations
            $currentMonthCancellations = Cancellation::whereYear('created_at', $year)
                                                   ->whereMonth('created_at', Carbon::now()->month)
                                                   ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_bookings' => $totalBookings,
                    'total_cancellations' => $totalCancellations,
                    'current_month_bookings' => $currentMonthBookings,
                    'current_month_cancellations' => $currentMonthCancellations,
                    'cancellation_rate' => $totalBookings > 0 ? round(($totalCancellations / $totalBookings) * 100, 2) : 0,
                    'year' => $year,
                ],
                'message' => 'Booking summary retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving booking summary: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get yearly booking and cancellation statistics
     */
    public function getYearlyStats(Request $request)
    {
        try {
            $startYear = $request->get('start_year', Carbon::now()->year - 5);
            $endYear = $request->get('end_year', Carbon::now()->year);
            
            // Get yearly booking counts (combining bookings and guest_bookings)
            $bookingStats = DB::select("
                SELECT 
                    YEAR(created_at) as year,
                    COUNT(*) as count
                FROM (
                    SELECT created_at FROM bookings WHERE YEAR(created_at) BETWEEN ? AND ? AND status != 'cancelled'
                    UNION ALL
                    SELECT created_at FROM guest_bookings WHERE YEAR(created_at) BETWEEN ? AND ? AND status != 'cancelled'
                ) as combined_bookings
                GROUP BY YEAR(created_at)
                ORDER BY year
            ", [$startYear, $endYear, $startYear, $endYear]);

            // Get yearly cancellation counts
            $cancellationStats = DB::select("
                SELECT 
                    YEAR(created_at) as year,
                    COUNT(*) as count
                FROM cancellations 
                WHERE YEAR(created_at) BETWEEN ? AND ?
                GROUP BY YEAR(created_at)
                ORDER BY year
            ", [$startYear, $endYear]);

            // Create arrays indexed by year
            $bookingsByYear = [];
            $cancellationsByYear = [];

            foreach ($bookingStats as $stat) {
                $bookingsByYear[$stat->year] = $stat->count;
            }

            foreach ($cancellationStats as $stat) {
                $cancellationsByYear[$stat->year] = $stat->count;
            }

            // Generate data for all years in range
            $yearlyData = [];

            for ($year = $startYear; $year <= $endYear; $year++) {
                $yearlyData[] = [
                    'name' => (string)$year,
                    'year' => $year,
                    'bookings' => $bookingsByYear[$year] ?? 0,
                    'cancellations' => $cancellationsByYear[$year] ?? 0,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $yearlyData,
                'start_year' => $startYear,
                'end_year' => $endYear,
                'message' => 'Yearly statistics retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving yearly statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get daily booking and cancellation statistics for current month
     */
    public function getDailyStats(Request $request)
    {
        try {
            $year = $request->get('year', Carbon::now()->year);
            $month = $request->get('month', Carbon::now()->month);
            
            // Get daily booking counts for the specified month (combining bookings and guest_bookings)
            $bookingStats = DB::select("
                SELECT 
                    DAY(created_at) as day,
                    COUNT(*) as count
                FROM (
                    SELECT created_at FROM bookings 
                    WHERE YEAR(created_at) = ? AND MONTH(created_at) = ? AND status != 'cancelled'
                    UNION ALL
                    SELECT created_at FROM guest_bookings 
                    WHERE YEAR(created_at) = ? AND MONTH(created_at) = ? AND status != 'cancelled'
                ) as combined_bookings
                GROUP BY DAY(created_at)
                ORDER BY day
            ", [$year, $month, $year, $month]);

            // Get daily cancellation counts for the specified month
            $cancellationStats = DB::select("
                SELECT 
                    DAY(created_at) as day,
                    COUNT(*) as count
                FROM cancellations 
                WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?
                GROUP BY DAY(created_at)
                ORDER BY day
            ", [$year, $month]);

            // Create arrays indexed by day
            $bookingsByDay = [];
            $cancellationsByDay = [];

            foreach ($bookingStats as $stat) {
                $bookingsByDay[$stat->day] = $stat->count;
            }

            foreach ($cancellationStats as $stat) {
                $cancellationsByDay[$stat->day] = $stat->count;
            }

            // Generate data for all days in the month (up to current day if current month)
            $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;
            $currentDate = Carbon::now();
            $isCurrentMonth = ($year == $currentDate->year && $month == $currentDate->month);
            $maxDay = $isCurrentMonth ? $currentDate->day : $daysInMonth;

            $dailyData = [];
            for ($day = 1; $day <= $maxDay; $day++) {
                $dailyData[] = [
                    'name' => (string)$day,
                    'day' => $day,
                    'bookings' => $bookingsByDay[$day] ?? 0,
                    'cancellations' => $cancellationsByDay[$day] ?? 0,
                ];
            }

            $monthName = Carbon::createFromDate($year, $month, 1)->format('F');

            return response()->json([
                'success' => true,
                'data' => $dailyData,
                'year' => $year,
                'month' => $month,
                'month_name' => $monthName,
                'days_in_month' => $daysInMonth,
                'message' => 'Daily statistics retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving daily statistics: ' . $e->getMessage()
            ], 500);
        }
    }
}
