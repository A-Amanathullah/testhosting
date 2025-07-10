<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\BusRoute;
use App\Models\RouteStop;
use App\Models\BusTrip;
use App\Models\BusRegister;
use App\Models\Booking;
use App\Models\GuestBooking;
use Carbon\Carbon;

class DebugSearch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:debug-search {from=Colombo} {to=Kalmunai} {date=2025-07-10}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Debug the bus search functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $fromLocation = $this->argument('from');
        $toLocation = $this->argument('to');
        $departureDate = $this->argument('date');

        $this->info("=== DEBUGGING SEARCH FOR: {$fromLocation} to {$toLocation} on {$departureDate} ===");
        $this->newLine();

        // Step 1: Check if both locations exist as route stops
        $this->info("Step 1: Checking if locations exist as route stops");
        $fromExists = RouteStop::where('stop_name', $fromLocation)->exists();
        $toExists = RouteStop::where('stop_name', $toLocation)->exists();
        $this->info("- {$fromLocation} exists: " . ($fromExists ? 'YES' : 'NO'));
        $this->info("- {$toLocation} exists: " . ($toExists ? 'YES' : 'NO'));
        $this->newLine();

        if (!$fromExists || !$toExists) {
            $this->error("One or both locations don't exist in route stops!");
            return;
        }

        // Step 2: Find routes that contain both locations
        $this->info("Step 2: Finding routes with both locations");
        $routesWithFrom = RouteStop::where('stop_name', $fromLocation)->pluck('bus_route_id')->toArray();
        $routesWithTo = RouteStop::where('stop_name', $toLocation)->pluck('bus_route_id')->toArray();

        $this->info("- Routes with {$fromLocation}: " . implode(', ', $routesWithFrom));
        $this->info("- Routes with {$toLocation}: " . implode(', ', $routesWithTo));

        $commonRoutes = array_intersect($routesWithFrom, $routesWithTo);
        $this->info("- Common routes: " . implode(', ', $commonRoutes));
        $this->newLine();

        if (empty($commonRoutes)) {
            $this->error("No routes contain both locations!");
            return;
        }

        // Step 3: Check stop order for each common route
        $this->info("Step 3: Checking stop order for common routes");
        $validRoutes = [];
        foreach ($commonRoutes as $routeId) {
            $route = BusRoute::find($routeId);
            $this->info("Route ID {$routeId}: {$route->route_name}");
            
            $fromStop = RouteStop::where('bus_route_id', $routeId)
                ->where('stop_name', $fromLocation)
                ->first();
            
            $toStop = RouteStop::where('bus_route_id', $routeId)
                ->where('stop_name', $toLocation)
                ->first();
            
            if ($fromStop && $toStop) {
                $this->info("  - {$fromLocation} order: {$fromStop->stop_order}");
                $this->info("  - {$toLocation} order: {$toStop->stop_order}");
                $isValidOrder = $fromStop->stop_order < $toStop->stop_order;
                $this->info("  - Valid order: " . ($isValidOrder ? 'YES' : 'NO'));
                
                if ($isValidOrder) {
                    $validRoutes[] = $routeId;
                }
            }
            $this->newLine();
        }

        if (empty($validRoutes)) {
            $this->error("No routes have correct stop order!");
            return;
        }

        // Step 4: Find bus trips for valid routes on the specified date
        $this->info("Step 4: Finding bus trips for valid routes on {$departureDate}");
        $this->info("- Valid routes (correct order): " . implode(', ', $validRoutes));

        $trips = BusTrip::whereIn('bus_route_id', $validRoutes)
            ->where('departure_date', $departureDate)
            ->get();

        $this->info("- Trips found for date: " . $trips->count());
        
        foreach ($trips as $trip) {
            $this->info("  Trip ID: {$trip->id}, Route ID: {$trip->bus_route_id}, Bus ID: {$trip->bus_id}");
            $this->info("  Available seats (DB): {$trip->available_seats}");
            
            // Check actual available seats calculation
            $bus = BusRegister::find($trip->bus_id);
            $totalSeats = $bus ? $bus->total_seats : 0;
            
            $regularBookings = Booking::where('bus_id', $trip->bus_id)
                ->where('departure_date', $trip->departure_date)
                ->whereIn('status', ['confirmed', 'freezed'])
                ->sum('reserved_tickets');
            
            $guestBookings = GuestBooking::where('bus_id', $trip->bus_id)
                ->where('departure_date', $trip->departure_date)
                ->whereIn('status', ['Confirmed', 'Processing'])
                ->sum('reserved_tickets');
            
            $bookedSeats = $regularBookings + $guestBookings;
            $actualAvailableSeats = $totalSeats - $bookedSeats;
            
            $this->info("  Total seats: {$totalSeats}");
            $this->info("  Regular bookings: {$regularBookings}");
            $this->info("  Guest bookings: {$guestBookings}");
            $this->info("  Actual available seats: {$actualAvailableSeats}");
            $this->info("  Meets availability filter (>0): " . ($actualAvailableSeats > 0 ? 'YES' : 'NO'));
            $this->newLine();
        }

        // Step 5: Test the actual search API logic
        $this->info("Step 5: Testing the actual search API logic");
        
        // Simulate the exact logic from BusTripController
        $validRoutes = BusRoute::whereHas('routeStops', function ($query) use ($fromLocation) {
            $query->where('stop_name', $fromLocation);
        })->whereHas('routeStops', function ($query) use ($toLocation) {
            $query->where('stop_name', $toLocation);
        })->with(['routeStops' => function ($query) use ($fromLocation, $toLocation) {
            $query->whereIn('stop_name', [$fromLocation, $toLocation])
                  ->orderBy('stop_order');
        }])->get();

        // Filter routes where from_location comes before to_location
        $validRoutes = $validRoutes->filter(function ($route) use ($fromLocation, $toLocation) {
            $fromOrder = $route->getStopOrder($fromLocation);
            $toOrder = $route->getStopOrder($toLocation);
            return $fromOrder !== null && $toOrder !== null && $fromOrder < $toOrder;
        });

        $this->info("- API logic found valid routes: " . $validRoutes->pluck('id')->implode(', '));

        if ($validRoutes->isEmpty()) {
            $this->error("API logic: No routes found between these locations");
            return;
        }

        // Get bus trips for these routes on the specified date
        $trips = BusTrip::whereIn('bus_route_id', $validRoutes->pluck('id'))
            ->where('departure_date', $departureDate)
            ->where('available_seats', '>', 0)
            ->with('busRoute.routeStops')
            ->get();

        $this->info("- API logic found trips (before filtering): " . $trips->count());

        // Additional validation: ensure the trip actually serves both locations
        $trips = $trips->filter(function ($trip) use ($fromLocation, $toLocation) {
            if (!$trip->busRoute) {
                return false;
            }
            
            $routeStops = $trip->busRoute->routeStops;
            $hasFromLocation = $routeStops->contains('stop_name', $fromLocation);
            $hasToLocation = $routeStops->contains('stop_name', $toLocation);
            
            // Ensure both locations exist and from comes before to
            if ($hasFromLocation && $hasToLocation) {
                $fromOrder = $trip->busRoute->getStopOrder($fromLocation);
                $toOrder = $trip->busRoute->getStopOrder($toLocation);
                return $fromOrder !== null && $toOrder !== null && $fromOrder < $toOrder;
            }
            
            return false;
        });

        $this->info("- API logic final trips (after filtering): " . $trips->count());

        $this->info("=== SEARCH DEBUGGING COMPLETE ===");
    }
}
