<?php

use App\Http\Controllers\BusRegController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BusTripController;
use App\Http\Controllers\GoogleMapsController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\BusRouteController;
use App\Http\Controllers\SmsTemplateController;
use App\Http\Controllers\LoyaltyCardController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\CancellationController;
use App\Http\Controllers\GuestBookingController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'register']);
Route::post('/google-login', [AuthController::class, 'googleLogin']);
Route::get('/users', [AuthController::class, 'index'])->middleware('auth:sanctum');;
Route::post('/admin/create-user', [AdminController::class, 'createUser']);
Route::get('/user', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::apiResource('bus-trips', BusTripController::class);
Route::post('/bus-reg', [BusRegController::class, 'store']);
Route::get('/bus-reg', [BusRegController::class, 'index']);
Route::put('/bus-reg/{id}', [BusRegController::class, 'update']);
Route::delete('/bus-reg/{id}', [BusRegController::class, 'destroy']);
Route::get('/directions', [GoogleMapsController::class, 'getDirections']);
Route::patch('/bookings/update-status', [BookingController::class, 'updateStatus']);
Route::apiResource('bookings', BookingController::class);
Route::apiResource('staffs', StaffController::class);
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
Route::get('/store-route/batticaloa', [BusRouteController::class, 'storeRouteViaBatticaloa']);
Route::post('/user-details', [AuthController::class, 'storeUserDetails'])->middleware('auth:sanctum');
Route::apiResource('sms-templates', SmsTemplateController::class);
Route::post('/change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');
Route::delete('/user/{id}', [AuthController::class, 'destroyUser'])->middleware('auth:sanctum');
Route::apiResource('loyalty-cards', LoyaltyCardController::class);
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

// Fallback for unknown API routes to return JSON 404
Route::fallback(function() {
    return response()->json(['status' => 'error', 'message' => 'API route not found'], 404);
});



