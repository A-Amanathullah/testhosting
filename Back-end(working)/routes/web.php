<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Google OAuth routes - these need session support and CORS
Route::middleware(['web'])->group(function () {
    Route::get('/api/auth/google/redirect', [AuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
    Route::get('/api/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
});

require __DIR__.'/auth.php';
