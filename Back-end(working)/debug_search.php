<?php

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use Carbon\Carbon;

// Database connection
$capsule = new Capsule;
$capsule->addConnection([
    'driver'    => 'sqlite',
    'database'  => __DIR__ . '/database/database.sqlite',
    'prefix'    => '',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

// Search parameters
$fromLocation = 'Colombo';
$toLocation = 'Kalmunai';
$departureDate = '2025-07-10';

echo "=== DEBUGGING SEARCH FOR: $fromLocation to $toLocation on $departureDate ===\n\n";

// Step 1: Check if both locations exist as route stops
echo "Step 1: Checking if locations exist as route stops\n";
$fromExists = Capsule::table('route_stops')->where('stop_name', $fromLocation)->exists();
$toExists = Capsule::table('route_stops')->where('stop_name', $toLocation)->exists();
echo "- $fromLocation exists: " . ($fromExists ? 'YES' : 'NO') . "\n";
echo "- $toLocation exists: " . ($toExists ? 'YES' : 'NO') . "\n\n";

// Step 2: Find routes that contain both locations
echo "Step 2: Finding routes with both locations\n";
$routesWithFrom = Capsule::table('route_stops')
    ->select('bus_route_id')
    ->where('stop_name', $fromLocation)
    ->pluck('bus_route_id')
    ->toArray();

$routesWithTo = Capsule::table('route_stops')
    ->select('bus_route_id')
    ->where('stop_name', $toLocation)
    ->pluck('bus_route_id')
    ->toArray();

echo "- Routes with $fromLocation: " . implode(', ', $routesWithFrom) . "\n";
echo "- Routes with $toLocation: " . implode(', ', $routesWithTo) . "\n";

$commonRoutes = array_intersect($routesWithFrom, $routesWithTo);
echo "- Common routes: " . implode(', ', $commonRoutes) . "\n\n";

// Step 3: Check stop order for each common route
echo "Step 3: Checking stop order for common routes\n";
foreach ($commonRoutes as $routeId) {
    $route = Capsule::table('bus_routes')->where('id', $routeId)->first();
    echo "Route ID $routeId: {$route->route_name}\n";
    
    $fromStop = Capsule::table('route_stops')
        ->where('bus_route_id', $routeId)
        ->where('stop_name', $fromLocation)
        ->first();
    
    $toStop = Capsule::table('route_stops')
        ->where('bus_route_id', $routeId)
        ->where('stop_name', $toLocation)
        ->first();
    
    if ($fromStop && $toStop) {
        echo "  - $fromLocation order: {$fromStop->stop_order}\n";
        echo "  - $toLocation order: {$toStop->stop_order}\n";
        echo "  - Valid order: " . ($fromStop->stop_order < $toStop->stop_order ? 'YES' : 'NO') . "\n";
    }
    echo "\n";
}

// Step 4: Find bus trips for valid routes on the specified date
echo "Step 4: Finding bus trips for valid routes on $departureDate\n";
$validRoutes = [];
foreach ($commonRoutes as $routeId) {
    $fromStop = Capsule::table('route_stops')
        ->where('bus_route_id', $routeId)
        ->where('stop_name', $fromLocation)
        ->first();
    
    $toStop = Capsule::table('route_stops')
        ->where('bus_route_id', $routeId)
        ->where('stop_name', $toLocation)
        ->first();
    
    if ($fromStop && $toStop && $fromStop->stop_order < $toStop->stop_order) {
        $validRoutes[] = $routeId;
    }
}

echo "- Valid routes (correct order): " . implode(', ', $validRoutes) . "\n\n";

$trips = Capsule::table('bus_trips')
    ->whereIn('bus_route_id', $validRoutes)
    ->where('departure_date', $departureDate)
    ->get();

echo "- Trips found for date: " . $trips->count() . "\n";
foreach ($trips as $trip) {
    echo "  Trip ID: {$trip->id}, Route ID: {$trip->bus_route_id}, Bus ID: {$trip->bus_id}\n";
    echo "  Available seats: {$trip->available_seats}\n";
    
    // Check actual available seats calculation
    $bus = Capsule::table('bus_reg')->where('id', $trip->bus_id)->first();
    $totalSeats = $bus ? $bus->total_seats : 0;
    
    $regularBookings = Capsule::table('bookings')
        ->where('bus_id', $trip->bus_id)
        ->where('departure_date', $trip->departure_date)
        ->whereIn('status', ['confirmed', 'freezed'])
        ->sum('reserved_tickets');
    
    $guestBookings = Capsule::table('guest_bookings')
        ->where('bus_id', $trip->bus_id)
        ->where('departure_date', $trip->departure_date)
        ->whereIn('status', ['Confirmed', 'Processing'])
        ->sum('reserved_tickets');
    
    $bookedSeats = $regularBookings + $guestBookings;
    $actualAvailableSeats = $totalSeats - $bookedSeats;
    
    echo "  Total seats: $totalSeats\n";
    echo "  Regular bookings: $regularBookings\n";
    echo "  Guest bookings: $guestBookings\n";
    echo "  Actual available seats: $actualAvailableSeats\n";
    echo "  Meets availability filter (>0): " . ($actualAvailableSeats > 0 ? 'YES' : 'NO') . "\n\n";
}

echo "=== SEARCH DEBUGGING COMPLETE ===\n";
