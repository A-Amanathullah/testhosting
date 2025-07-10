<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Available route stops:\n";
$stops = App\Models\RouteStop::select('stop_name')->distinct()->get();
foreach ($stops as $stop) {
    echo "- " . $stop->stop_name . "\n";
}

echo "\nBus routes:\n";
$routes = App\Models\BusRoute::with('routeStops')->get();
foreach ($routes as $route) {
    echo "Route ID: " . $route->id . " - " . $route->route_name . "\n";
    echo "  Stops: ";
    foreach ($route->routeStops->sortBy('stop_order') as $stop) {
        echo $stop->stop_name . " -> ";
    }
    echo "\n\n";
}

echo "\nBus trips for 2025-07-10:\n";
$trips = App\Models\BusTrip::where('departure_date', '2025-07-10')->with('busRoute')->get();
foreach ($trips as $trip) {
    echo "Trip ID: " . $trip->id . " - Route: " . ($trip->busRoute ? $trip->busRoute->route_name : 'No route') . " - Date: " . $trip->departure_date . "\n";
}
