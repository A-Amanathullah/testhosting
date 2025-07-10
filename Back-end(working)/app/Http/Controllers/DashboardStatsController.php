<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\GuestBooking;
use App\Models\Cancellation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardStatsController extends Controller
{
    /**
     * Get today's booking statistics
     */
    public function getTodayBookings()
    {
        try {
            $today = Carbon::today();
            $yesterday = Carbon::yesterday();

            // Count today's bookings from both booking and guest_booking tables
            $todayUserBookings = Booking::whereDate('booked_date', $today)->count();
            $todayGuestBookings = GuestBooking::whereDate('created_at', $today)->count();
            $todayTotal = $todayUserBookings + $todayGuestBookings;

            // Count yesterday's bookings for comparison
            $yesterdayUserBookings = Booking::whereDate('booked_date', $yesterday)->count();
            $yesterdayGuestBookings = GuestBooking::whereDate('created_at', $yesterday)->count();
            $yesterdayTotal = $yesterdayUserBookings + $yesterdayGuestBookings;

            // Calculate percentage change
            $percentChange = 0;
            if ($yesterdayTotal > 0) {
                $percentChange = (($todayTotal - $yesterdayTotal) / $yesterdayTotal) * 100;
            } elseif ($todayTotal > 0) {
                $percentChange = 100; // If no bookings yesterday but some today
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'count' => $todayTotal,
                    'user_bookings' => $todayUserBookings,
                    'guest_bookings' => $todayGuestBookings,
                    'percent_change' => round($percentChange, 1),
                    'yesterday_count' => $yesterdayTotal
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching booking statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get today's cancellation statistics
     */
    public function getTodayCancellations()
    {
        try {
            $today = Carbon::today();
            $yesterday = Carbon::yesterday();

            // Count today's cancellations
            $todayCount = Cancellation::whereDate('created_at', $today)->count();

            // Count yesterday's cancellations for comparison
            $yesterdayCount = Cancellation::whereDate('created_at', $yesterday)->count();

            // Calculate percentage change
            $percentChange = 0;
            if ($yesterdayCount > 0) {
                $percentChange = (($todayCount - $yesterdayCount) / $yesterdayCount) * 100;
            } elseif ($todayCount > 0) {
                $percentChange = 100;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'count' => $todayCount,
                    'percent_change' => round($percentChange, 1),
                    'yesterday_count' => $yesterdayCount
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching cancellation statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get agent booking statistics
     */
    public function getAgentBookingStats()
    {
        try {
            // Get total number of agents
            $totalAgents = User::where('role', 'agent')->count();

            // Get top agent by bookings (combining both booking tables)
            $agentBookingStats = DB::select("
                SELECT 
                    u.id,
                    u.name,
                    (
                        SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.id AND b.role = 'agent'
                    ) + (
                        SELECT COUNT(*) FROM guest_bookings gb WHERE gb.agent_id = u.id
                    ) as total_bookings
                FROM users u 
                WHERE u.role = 'agent'
                ORDER BY total_bookings DESC
                LIMIT 1
            ");

            $topAgent = null;
            $topAgentBookings = 0;

            if (!empty($agentBookingStats)) {
                $topAgent = $agentBookingStats[0]->name;
                $topAgentBookings = $agentBookingStats[0]->total_bookings;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'total_agents' => $totalAgents,
                    'top_agent_name' => $topAgent ?? 'No agents found',
                    'top_agent_bookings' => $topAgentBookings
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching agent booking statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get staff statistics
     */
    public function getStaffStats()
    {
        try {
            // Get total staff (excluding regular users and agents)
            $totalStaff = User::whereNotIn('role', ['user', 'agent'])->count();

            // For "online now" status, we'll check users who have logged in within the last 30 minutes
            // This is a simplified approach - you might want to implement a more sophisticated online tracking system
            $onlineStaff = User::whereNotIn('role', ['user', 'agent'])
                ->where('updated_at', '>=', Carbon::now()->subMinutes(30))
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_staff' => $totalStaff,
                    'online_now' => $onlineStaff
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching staff statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get monthly revenue statistics for the current year
     */
    public function getMonthlyRevenue()
    {
        try {
            $currentYear = Carbon::now()->year;
            $monthlyData = [];

            for ($month = 1; $month <= 12; $month++) {
                $startDate = Carbon::create($currentYear, $month, 1)->startOfMonth();
                $endDate = Carbon::create($currentYear, $month, 1)->endOfMonth();

                // Calculate revenue from bookings
                $bookingRevenue = Booking::whereBetween('booked_date', [$startDate, $endDate])
                    ->where('status', 'confirmed')
                    ->sum('price');

                // Calculate revenue from guest bookings
                $guestBookingRevenue = GuestBooking::whereBetween('created_at', [$startDate, $endDate])
                    ->where('status', 'confirmed')
                    ->sum('price');

                // Subtract cancellation refunds
                $cancellationRefunds = Cancellation::whereBetween('created_at', [$startDate, $endDate])
                    ->where('payment_status', 'refunded')
                    ->sum('price');

                $totalRevenue = $bookingRevenue + $guestBookingRevenue - $cancellationRefunds;

                $monthlyData[] = [
                    'name' => $startDate->format('M'),
                    'revenue' => $totalRevenue,
                    'month' => $month,
                    'year' => $currentYear
                ];
            }

            // Calculate previous year total for comparison
            $previousYear = $currentYear - 1;
            $previousYearRevenue = $this->calculateYearlyRevenue($previousYear);
            $currentYearRevenue = array_sum(array_column($monthlyData, 'revenue'));

            $growthPercent = 0;
            if ($previousYearRevenue > 0) {
                $growthPercent = (($currentYearRevenue - $previousYearRevenue) / $previousYearRevenue) * 100;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'monthly_data' => $monthlyData,
                    'total_revenue' => $currentYearRevenue,
                    'previous_year_revenue' => $previousYearRevenue,
                    'growth_percent' => round($growthPercent, 1)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching monthly revenue statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get daily revenue statistics for the last 30 days
     */
    public function getDailyRevenue()
    {
        try {
            $dailyData = [];
            $today = Carbon::today();

            for ($i = 29; $i >= 0; $i--) {
                $date = $today->copy()->subDays($i);
                $startDate = $date->startOfDay();
                $endDate = $date->endOfDay();

                // Calculate revenue from bookings
                $bookingRevenue = Booking::whereBetween('booked_date', [$startDate, $endDate])
                    ->where('status', 'confirmed')
                    ->sum('price');

                // Calculate revenue from guest bookings
                $guestBookingRevenue = GuestBooking::whereBetween('created_at', [$startDate, $endDate])
                    ->where('status', 'confirmed')
                    ->sum('price');

                // Subtract cancellation refunds
                $cancellationRefunds = Cancellation::whereBetween('created_at', [$startDate, $endDate])
                    ->where('payment_status', 'refunded')
                    ->sum('price');

                $totalRevenue = $bookingRevenue + $guestBookingRevenue - $cancellationRefunds;

                $dailyData[] = [
                    'name' => $date->format('j'), // Day of month
                    'revenue' => $totalRevenue,
                    'full_date' => $date->format('M j'), // e.g., "Jul 9"
                    'date' => $date->format('Y-m-d')
                ];
            }

            // Calculate today vs yesterday comparison
            $todayRevenue = end($dailyData)['revenue'];
            $yesterdayRevenue = $dailyData[count($dailyData) - 2]['revenue'] ?? 0;

            $changePercent = 0;
            if ($yesterdayRevenue > 0) {
                $changePercent = (($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100;
            } elseif ($todayRevenue > 0) {
                $changePercent = 100;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'daily_data' => $dailyData,
                    'today_revenue' => $todayRevenue,
                    'yesterday_revenue' => $yesterdayRevenue,
                    'change_percent' => round($changePercent, 1)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching daily revenue statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get yearly revenue statistics for the last 6 years
     */
    public function getYearlyRevenue()
    {
        try {
            $currentYear = Carbon::now()->year;
            $yearlyData = [];

            // Get data for the last 6 years
            for ($i = 5; $i >= 0; $i--) {
                $year = $currentYear - $i;
                $revenue = $this->calculateYearlyRevenue($year);

                $yearlyData[] = [
                    'name' => (string)$year,
                    'revenue' => $revenue,
                    'year' => $year,
                    'projected' => $year === $currentYear // Mark current year as projected
                ];
            }

            // Calculate year-over-year growth
            $currentYearRevenue = end($yearlyData)['revenue'];
            $previousYearRevenue = $yearlyData[count($yearlyData) - 2]['revenue'] ?? 0;

            $growthPercent = 0;
            if ($previousYearRevenue > 0) {
                $growthPercent = (($currentYearRevenue - $previousYearRevenue) / $previousYearRevenue) * 100;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'yearly_data' => $yearlyData,
                    'current_year_revenue' => $currentYearRevenue,
                    'previous_year_revenue' => $previousYearRevenue,
                    'growth_percent' => round($growthPercent, 1)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching yearly revenue statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper method to calculate total revenue for a specific year
     */
    private function calculateYearlyRevenue($year)
    {
        $startDate = Carbon::create($year, 1, 1)->startOfYear();
        $endDate = Carbon::create($year, 12, 31)->endOfYear();

        // Calculate revenue from bookings
        $bookingRevenue = Booking::whereBetween('booked_date', [$startDate, $endDate])
            ->where('status', 'confirmed')
            ->sum('price');

        // Calculate revenue from guest bookings
        $guestBookingRevenue = GuestBooking::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'confirmed')
            ->sum('price');

        // Subtract cancellation refunds
        $cancellationRefunds = Cancellation::whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_status', 'refunded')
            ->sum('price');

        return $bookingRevenue + $guestBookingRevenue - $cancellationRefunds;
    }

    /**
     * Get all dashboard statistics in one call
     */
    public function getAllStats()
    {
        try {
            $bookingStats = $this->getTodayBookings()->getData();
            $cancellationStats = $this->getTodayCancellations()->getData();
            $agentStats = $this->getAgentBookingStats()->getData();
            $staffStats = $this->getStaffStats()->getData();

            return response()->json([
                'success' => true,
                'data' => [
                    'bookings' => $bookingStats->data ?? null,
                    'cancellations' => $cancellationStats->data ?? null,
                    'agents' => $agentStats->data ?? null,
                    'staff' => $staffStats->data ?? null
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
