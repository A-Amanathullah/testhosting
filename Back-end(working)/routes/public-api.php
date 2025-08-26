<?php

use App\Http\Controllers\BusTripController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\SriLankanLocationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register public API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group without CSRF protection.
|
*/

// Public search routes (no authentication required)
Route::post('/bus-trips/search-by-route', [BusTripController::class, 'searchByRoute']);

// Public location routes for autocomplete
Route::get('/locations/search', [LocationController::class, 'searchLocations']);
Route::get('/locations', [LocationController::class, 'getAllLocations']);
Route::get('/locations/major-stops', [LocationController::class, 'getMajorStops']);

// Public Sri Lankan locations routes for advanced autocomplete
Route::get('/sri-lankan-locations/search', [SriLankanLocationController::class, 'search']);
Route::get('/sri-lankan-locations/districts', [SriLankanLocationController::class, 'getDistricts']);
Route::get('/sri-lankan-locations/provinces', [SriLankanLocationController::class, 'getProvinces']);
Route::get('/sri-lankan-locations/district/{district}', [SriLankanLocationController::class, 'getByDistrict']);
Route::get('/sri-lankan-locations/major-stops', [SriLankanLocationController::class, 'getMajorStops']);
Route::get('/sri-lankan-locations/sync-stats', [SriLankanLocationController::class, 'getSyncStats']);
