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


Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'register']);
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



