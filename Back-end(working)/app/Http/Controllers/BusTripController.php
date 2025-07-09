<?php

namespace App\Http\Controllers;

use App\Models\BusTrip;
use App\Models\BusRoute;
use App\Models\RouteStop;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\BusRegister;
use App\Models\Booking;
use App\Models\GuestBooking;

class BusTripController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $trips = BusTrip::all();
        $trips->transform(function ($trip) {
            $bus = BusRegister::find($trip->bus_id);
            $total_seats = $bus ? $bus->total_seats : 0;
            $booked_seats = 0;
            if ($trip->bus_id && $trip->departure_date) {
                // Calculate booked seats from regular bookings table
                $regular_bookings = Booking::where('bus_id', $trip->bus_id)
                    ->where('departure_date', $trip->departure_date)
                    ->whereIn('status', ['confirmed', 'freezed'])
                    ->sum('reserved_tickets');
                
                // Calculate booked seats from guest bookings table
                $guest_bookings = GuestBooking::where('bus_id', $trip->bus_id)
                    ->where('departure_date', $trip->departure_date)
                    ->whereIn('status', ['Confirmed', 'Processing']) // Include both confirmed and processing guest bookings
                    ->sum('reserved_tickets');
                
                // Total booked seats from both tables
                $booked_seats = $regular_bookings + $guest_bookings;
            }
            if ($booked_seats > 0) {
                $trip->available_seats = $total_seats - $booked_seats;
            } else {
                $trip->available_seats = $total_seats;
            }
            $trip->booked_seats = $booked_seats;
            return $trip;
        });
        
        // Convert trips to array and format dates consistently
        $formattedTrips = $trips->map(function ($trip) {
            $tripArray = $trip->toArray();
            
            // Ensure all dates are in YYYY-MM-DD format for consistency
            if (isset($tripArray['departure_date'])) {
                // Parse then format to ensure consistency
                $tripArray['departure_date'] = Carbon::parse($tripArray['departure_date'])->format('Y-m-d');
            }
            
            if (isset($tripArray['arrival_date'])) {
                // Parse then format to ensure consistency
                $tripArray['arrival_date'] = Carbon::parse($tripArray['arrival_date'])->format('Y-m-d');
            }
            
            return $tripArray;
        });
        
        return response()->json($formattedTrips);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'bus_id' => 'required|exists:bus_reg,id',
            'bus_no' => 'required|exists:bus_reg,bus_no',
            'bus_route_id' => 'required|exists:bus_routes,id',
            'driver_name' => 'required|string',
            'driver_contact' => 'required|string',
            'conductor_name' => 'required|string',
            'conductor_contact' => 'required|string',
            'start_point' => 'required|string',
            'end_point' => 'required|string',
            'departure_date' => 'required|date',
            'departure_time' => 'required',
            'price' => 'required|numeric',
            'available_seats' => 'required|integer',
            'arrival_date' => 'required|date',
            'arrival_time' => 'required',
        ]);

        // Parse dates properly - extract just the date part if it's a full datetime string
        $departureDate = Carbon::parse($validatedData['departure_date'])->format('Y-m-d');
        $arrivalDate = Carbon::parse($validatedData['arrival_date'])->format('Y-m-d');
        
        $departure = Carbon::parse($departureDate . ' ' . $validatedData['departure_time']);
        $arrival = Carbon::parse($arrivalDate . ' ' . $validatedData['arrival_time']);

        $durationFloat = $departure->floatDiffInHours($arrival);

        $hours = floor($durationFloat); // Get whole hours
        $minutes = round(($durationFloat - $hours) * 60); // Get remaining minutes

        $durationFormatted = "{$hours}h {$minutes}m";

        $validatedData['duration'] = $durationFormatted;
        // automatic calculation

        BusTrip::create($validatedData);

        return response()->json(['message' => 'Schedule created successfully']);
    }


    /**
     * Display the specified resource.
     */
    public function show(BusTrip $busTrip)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BusTrip $busTrip)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'bus_no' => 'required|string|max:255',
            'bus_route_id' => 'required|exists:bus_routes,id',
            'driver_name' => 'required|string|max:255',
            'driver_contact' => 'required|string|max:20',
            'conductor_name' => 'required|string|max:255',
            'conductor_contact' => 'required|string|max:20',
            'start_point' => 'required|string|max:255',
            'end_point' => 'required|string|max:255',
            'departure_date' => 'required|date',
            'departure_time' => 'required|string',
            'arrival_date' => 'required|date',
            'arrival_time' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $trip = BusTrip::findOrFail($id);

        // Parse dates properly - extract just the date part if it's a full datetime string
        $departureDate = Carbon::parse($request->departure_date)->format('Y-m-d');
        $arrivalDate = Carbon::parse($request->arrival_date)->format('Y-m-d');
        
        $departure = Carbon::parse($departureDate . ' ' . $request->departure_time);
        $arrival = Carbon::parse($arrivalDate . ' ' . $request->arrival_time);
        $durationFloat = $departure->floatDiffInHours($arrival);

        $hours = floor($durationFloat); // Get whole hours
        $minutes = round(($durationFloat - $hours) * 60); // Get remaining minutes

        $durationFormatted = "{$hours}h {$minutes}m";

        $validatedData['duration'] = $durationFormatted;
        // auto-calculate duration

        $trip->update([
            'bus_no' => $request->bus_no,
            'bus_route_id' => $request->bus_route_id,
            'driver_name' => $request->driver_name,
            'driver_contact' => $request->driver_contact,
            'conductor_name' => $request->conductor_name,
            'conductor_contact' => $request->conductor_contact,
            'start_point' => $request->start_point,
            'end_point' => $request->end_point,
            'departure_date' => $request->departure_date,
            'departure_time' => $request->departure_time,
            'arrival_date' => $request->arrival_date,
            'arrival_time' => $request->arrival_time,
            'price' => $request->price,
            'duration' => $validatedData['duration'],
        ]);

        return response()->json(['message' => 'Schedule updated successfully.']);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $trip = BusTrip::findOrFail($id);
        $trip->delete();

        return response()->json(['message' => 'Schedule deleted successfully.']);
    }

    /**
     * Search bus trips based on route stops
     */
    public function searchByRoute(Request $request)
    {
        $request->validate([
            'from_location' => 'required|string',
            'to_location' => 'required|string',
            'departure_date' => 'required|date',
        ]);

        $fromLocation = trim($request->from_location);
        $toLocation = trim($request->to_location);
        $departureDate = Carbon::parse($request->departure_date)->format('Y-m-d');

        // Debug logging
        \Log::info('Search request:', [
            'from' => $fromLocation,
            'to' => $toLocation,
            'date' => $departureDate
        ]);

        // Find routes that contain both locations
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

        if ($validRoutes->isEmpty()) {
            return response()->json([
                'message' => 'No routes found between these locations',
                'trips' => []
            ]);
        }

        // Get bus trips for these routes on the specified date
        $trips = BusTrip::whereIn('bus_route_id', $validRoutes->pluck('id'))
            ->where('departure_date', $departureDate)
            ->where('available_seats', '>', 0)
            ->with('busRoute.routeStops')
            ->get();

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

        // Calculate actual journey details for each trip
        $trips->transform(function ($trip) use ($fromLocation, $toLocation) {
            $bus = BusRegister::find($trip->bus_id);
            $total_seats = $bus ? $bus->total_seats : 0;
            
            // Calculate booked seats
            $regular_bookings = Booking::where('bus_id', $trip->bus_id)
                ->where('departure_date', $trip->departure_date)
                ->whereIn('status', ['confirmed', 'freezed'])
                ->sum('reserved_tickets');
            
            $guest_bookings = GuestBooking::where('bus_id', $trip->bus_id)
                ->where('departure_date', $trip->departure_date)
                ->whereIn('status', ['Confirmed', 'Processing'])
                ->sum('reserved_tickets');
            
            $booked_seats = $regular_bookings + $guest_bookings;
            $trip->available_seats = $total_seats - $booked_seats;
            $trip->booked_seats = $booked_seats;

            // Calculate journey-specific details
            if ($trip->busRoute) {
                $fromStop = $trip->busRoute->routeStops->where('stop_name', $fromLocation)->first();
                $toStop = $trip->busRoute->routeStops->where('stop_name', $toLocation)->first();

                if ($fromStop && $toStop) {
                    // Calculate journey duration and fare
                    $durationDiff = $toStop->duration_from_start - $fromStop->duration_from_start;
                    $fareDiff = $toStop->fare_from_start - $fromStop->fare_from_start;

                    $trip->journey_duration = $durationDiff . ' minutes';
                    $trip->journey_fare = $fareDiff;
                    $trip->actual_start_point = $fromLocation;
                    $trip->actual_end_point = $toLocation;

                    // Calculate actual departure and arrival times
                    $departureDateStr = $trip->departure_date instanceof Carbon 
                        ? $trip->departure_date->format('Y-m-d') 
                        : $trip->departure_date;
                    $departureTimeStr = $trip->departure_time instanceof Carbon 
                        ? $trip->departure_time->format('H:i:s') 
                        : $trip->departure_time;
                    
                    $baseDeparture = Carbon::parse($departureDateStr . ' ' . $departureTimeStr);
                    $actualDeparture = $baseDeparture->copy()->addMinutes($fromStop->duration_from_start ?? 0);
                    $actualArrival = $baseDeparture->copy()->addMinutes($toStop->duration_from_start ?? 0);

                    $trip->actual_departure_time = $actualDeparture->format('H:i');
                    $trip->actual_arrival_time = $actualArrival->format('H:i');
                }
            }

            return $trip;
        });

        // Convert trips collection to array for manipulation
        $formattedTrips = $trips->map(function ($trip) {
            $tripArray = $trip->toArray();
            
            // Ensure all dates are in YYYY-MM-DD format for consistency
            if (isset($tripArray['departure_date'])) {
                // Parse then format to ensure consistency
                $tripArray['departure_date'] = Carbon::parse($tripArray['departure_date'])->format('Y-m-d');
            }
            
            if (isset($tripArray['arrival_date'])) {
                // Parse then format to ensure consistency
                $tripArray['arrival_date'] = Carbon::parse($tripArray['arrival_date'])->format('Y-m-d');
            }
            
            return $tripArray;
        });

        return response()->json([
            'message' => 'Search completed successfully',
            'trips' => $formattedTrips,
            'search_params' => [
                'from' => $fromLocation,
                'to' => $toLocation,
                'date' => Carbon::parse($departureDate)->format('Y-m-d')
            ]
        ]);
    }

}
