<?php

use App\Http\Controllers\BusRegController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BusTripController;
use App\Http\Controllers\GoogleMapsController;
use App\Http\Controllers\BookingController;
// use App\Http\Controllers\StaffController;
use App\Http\Controllers\BusRouteController;
use App\Http\Controllers\SmsTemplateController;
use App\Http\Controllers\LoyaltyCardController;
use App\Http\Controllers\LoyaltyMemberController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\CancellationController;
use App\Http\Controllers\GuestBookingController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\BookingStatsController;
use App\Http\Controllers\SriLankanLocationController;
use App\Http\Controllers\DashboardStatsController;
use App\Http\Controllers\AgentCommissionController;

// Public authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'register']);
Route::post('/google-login', [AuthController::class, 'googleLogin']);

// Public API routes (no authentication required)
Route::post('/admin/create-user', [AdminController::class, 'createUser']);
Route::apiResource('bus-trips', BusTripController::class);
Route::post('/sri-lankan-locations/{id}/verify', [SriLankanLocationController::class, 'verify']);
Route::apiResource('sri-lankan-locations', SriLankanLocationController::class)->only(['store', 'update']);
Route::post('/bus-reg', [BusRegController::class, 'store']);
Route::get('/bus-reg', [BusRegController::class, 'index']);
Route::put('/bus-reg/{id}', [BusRegController::class, 'update']);
Route::delete('/bus-reg/{id}', [BusRegController::class, 'destroy']);
Route::get('/directions', [GoogleMapsController::class, 'getDirections']);
Route::patch('/bookings/update-status', [BookingController::class, 'updateStatus']);
Route::apiResource('bookings', BookingController::class);
Route::apiResource('sms-templates', SmsTemplateController::class);
Route::apiResource('loyalty-cards', LoyaltyCardController::class);

// Loyalty Members routes - specific routes first
Route::post('/loyalty-members/create-all', [LoyaltyMemberController::class, 'createMembersForAllUsers']);
Route::post('/loyalty-members/create-for-user', [LoyaltyMemberController::class, 'createMemberForUser']);
Route::post('/loyalty-members/refresh-all', [LoyaltyMemberController::class, 'refreshAllMembersData']);
Route::post('/loyalty-members/remove-agents', [LoyaltyMemberController::class, 'removeAgentMembers']);
Route::post('/loyalty-members/{id}/refresh', [LoyaltyMemberController::class, 'refreshMemberData']);
Route::patch('/loyalty-members/{id}/status', [LoyaltyMemberController::class, 'updateStatus']);
Route::get('/loyalty-members/statistics', [LoyaltyMemberController::class, 'getStatistics']);
Route::get('/loyalty-members/report', [LoyaltyMemberController::class, 'getReport']);
Route::apiResource('loyalty-members', LoyaltyMemberController::class)->only(['index', 'show', 'destroy']);
Route::get('/role-permissions', [RolePermissionController::class, 'index']);
Route::get('/role-permissions/{role}', [RolePermissionController::class, 'show']);
Route::post('/role-permissions', [RolePermissionController::class, 'store']);
Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles', [RoleController::class, 'store']);
Route::get('/cancellations', [CancellationController::class, 'index']);
Route::post('/bookings/{id}/cancel', [CancellationController::class, 'cancel']);
Route::apiResource('guest-bookings', GuestBookingController::class)->only(['index', 'store', 'update', 'destroy']);
Route::post('/guest-bookings/{id}/cancel', [GuestBookingController::class, 'cancel']);
Route::get('/guest-bookings/agent/{agentId}', [GuestBookingController::class, 'getByAgent']);
Route::get('/agents', [GuestBookingController::class, 'getAgents']);

// Bus route endpoints
Route::get('/bus-routes', [BusRouteController::class, 'index']);
Route::get('/bus-routes/{id}', [BusRouteController::class, 'show']);
Route::post('/bus-routes', [BusRouteController::class, 'store']);
Route::put('/bus-routes/{id}', [BusRouteController::class, 'update']);
Route::delete('/bus-routes/{id}', [BusRouteController::class, 'destroy']);

// Booking Statistics Routes
Route::get('/booking-stats/monthly', [BookingStatsController::class, 'getMonthlyStats']);
Route::get('/booking-stats/yearly', [BookingStatsController::class, 'getYearlyStats']);
Route::get('/booking-stats/daily', [BookingStatsController::class, 'getDailyStats']);
Route::get('/booking-stats/summary', [BookingStatsController::class, 'getBookingSummary']);

// Dashboard Statistics Routes
Route::get('/dashboard/revenue/daily', [DashboardStatsController::class, 'getDailyRevenue']);
Route::get('/dashboard/revenue/monthly', [DashboardStatsController::class, 'getMonthlyRevenue']);
Route::get('/dashboard/revenue/yearly', [DashboardStatsController::class, 'getYearlyRevenue']);
Route::get('/dashboard/stats/all', [DashboardStatsController::class, 'getAllStats']);
Route::get('/dashboard/stats/bookings', [DashboardStatsController::class, 'getTodayBookings']);
Route::get('/dashboard/stats/cancellations', [DashboardStatsController::class, 'getTodayCancellations']);
Route::get('/dashboard/stats/agents', [DashboardStatsController::class, 'getAgentBookingStats']);
Route::get('/dashboard/stats/staff', [DashboardStatsController::class, 'getStaffStats']);

// Agent Commission routes
Route::apiResource('agent-commissions', AgentCommissionController::class);
Route::post('/agent-commissions/calculate', [AgentCommissionController::class, 'calculateCommission']);
Route::post('/agent-commissions/initialize', [AgentCommissionController::class, 'initializeAgentCommissions']);
Route::get('/agent-commissions/user/{userId}', [AgentCommissionController::class, 'getAgentCommissions']);

// Routes that require authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::get('/users', [AuthController::class, 'index']); // Moved here - requires admin access
    Route::post('/user-details', [AuthController::class, 'storeUserDetails']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::delete('/user/{id}', [AuthController::class, 'destroyUser']);
    
    // Conductor specific routes
    Route::get('/conductor/trips', [BusTripController::class, 'getConductorTrips']);
    Route::get('/conductor/trip/{tripId}', [BusTripController::class, 'getConductorTripDetails']);
});

// Fallback for unknown API routes to return JSON 404
Route::fallback(function() {
    return response()->json(['status' => 'error', 'message' => 'API route not found'], 404);
});
