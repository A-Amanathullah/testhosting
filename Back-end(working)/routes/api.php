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


Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'register']);
Route::post('/google-login', [AuthController::class, 'googleLogin']);
Route::get('/users', [AuthController::class, 'index'])->middleware('auth:sanctum');;
Route::post('/admin/create-user', [AdminController::class, 'createUser']);
Route::get('/user', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::apiResource('bus-trips', BusTripController::class);

// Route-based search routes
Route::post('/bus-trips/search-by-route', [BusTripController::class, 'searchByRoute']);

// Location routes for autocomplete
Route::get('/locations/search', [LocationController::class, 'searchLocations']);
Route::get('/locations', [LocationController::class, 'getAllLocations']);
Route::get('/locations/major-stops', [LocationController::class, 'getMajorStops']);

// Sri Lankan locations routes for advanced autocomplete
Route::get('/sri-lankan-locations/search', [SriLankanLocationController::class, 'search']);
Route::get('/sri-lankan-locations/districts', [SriLankanLocationController::class, 'getDistricts']);
Route::get('/sri-lankan-locations/provinces', [SriLankanLocationController::class, 'getProvinces']);
Route::get('/sri-lankan-locations/district/{district}', [SriLankanLocationController::class, 'getByDistrict']);
Route::get('/sri-lankan-locations/major-stops', [SriLankanLocationController::class, 'getMajorStops']);
Route::get('/sri-lankan-locations/sync-stats', [SriLankanLocationController::class, 'getSyncStats']);
Route::post('/sri-lankan-locations/{id}/verify', [SriLankanLocationController::class, 'verify']);
Route::apiResource('sri-lankan-locations', SriLankanLocationController::class)->only(['store', 'update']);

Route::post('/bus-reg', [BusRegController::class, 'store']);
Route::get('/bus-reg', [BusRegController::class, 'index']);
Route::put('/bus-reg/{id}', [BusRegController::class, 'update']);
Route::delete('/bus-reg/{id}', [BusRegController::class, 'destroy']);
Route::get('/directions', [GoogleMapsController::class, 'getDirections']);
Route::patch('/bookings/update-status', [BookingController::class, 'updateStatus']);
Route::apiResource('bookings', BookingController::class);
// Route::apiResource('staffs', StaffController::class);
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
Route::post('/user-details', [AuthController::class, 'storeUserDetails'])->middleware('auth:sanctum');
Route::apiResource('sms-templates', SmsTemplateController::class);
Route::post('/change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');
Route::delete('/user/{id}', [AuthController::class, 'destroyUser'])->middleware('auth:sanctum');
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

// Dashboard stats routes (protected by auth middleware)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/stats/bookings', [DashboardStatsController::class, 'getTodayBookings']);
    Route::get('/dashboard/stats/cancellations', [DashboardStatsController::class, 'getTodayCancellations']);
    Route::get('/dashboard/stats/agents', [DashboardStatsController::class, 'getAgentBookingStats']);
    Route::get('/dashboard/stats/staff', [DashboardStatsController::class, 'getStaffStats']);
    Route::get('/dashboard/stats/all', [DashboardStatsController::class, 'getAllStats']);
    
    // Revenue statistics routes
    Route::get('/dashboard/revenue/monthly', [DashboardStatsController::class, 'getMonthlyRevenue']);
    Route::get('/dashboard/revenue/daily', [DashboardStatsController::class, 'getDailyRevenue']);
    Route::get('/dashboard/revenue/yearly', [DashboardStatsController::class, 'getYearlyRevenue']);
});

// Fallback for unknown API routes to return JSON 404
Route::fallback(function() {
    return response()->json(['status' => 'error', 'message' => 'API route not found'], 404);
});



