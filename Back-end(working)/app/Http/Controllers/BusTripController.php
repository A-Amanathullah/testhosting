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
use App\Models\UserDetail;

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
     * Get trips assigned to logged-in conductor
     */
    public function getConductorTrips(Request $request)
    {
        $user = $request->user();
        $userDetail = UserDetail::where('user_id', $user->id)->first();
        
        if (!$userDetail) {
            return response()->json(['error' => 'User details not found'], 404);
        }
        
        // Multiple name matching strategies
        $fullName = trim($userDetail->first_name . ' ' . $userDetail->last_name);
        $userName = $user->name;
        $firstName = $userDetail->first_name;
        $lastName = $userDetail->last_name;
        
        // Fetch trips using multiple matching strategies
        $trips = BusTrip::where(function ($query) use ($fullName, $userName, $firstName, $lastName) {
            $query->where('conductor_name', $fullName)
                  ->orWhere('conductor_name', $userName)
                  ->orWhere('conductor_name', 'LIKE', "%{$firstName}%")
                  ->orWhere('conductor_name', 'LIKE', "%{$lastName}%");
        })
        ->with('busRoute.routeStops')
        ->orderBy('departure_date', 'desc')
        ->orderBy('departure_time', 'desc')
        ->get();

        // Transform trips to include calculated seat information
        $trips->transform(function ($trip) {
            $bus = BusRegister::find($trip->bus_id);
            $total_seats = $bus ? $bus->total_seats : 0;
            
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
            $trip->total_seats = $total_seats;
            
            return $trip;
        });
        
        return response()->json([
            'trips' => $trips,
            'conductor_name' => $fullName,
            'debug_info' => [
                'user_name' => $userName,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'full_name' => $fullName,
                'trips_count' => $trips->count()
            ]
        ]);
    }

    /**
     * Get detailed information about a specific trip including bookings and seat layout
     */
    public function getConductorTripDetails(Request $request, $tripId)
    {
        $user = $request->user();
        $userDetail = UserDetail::where('user_id', $user->id)->first();
        
        if (!$userDetail) {
            return response()->json(['error' => 'User details not found'], 404);
        }
        
        // Find the trip
        $trip = BusTrip::with('busRoute.routeStops')->find($tripId);
        
        if (!$trip) {
            return response()->json(['error' => 'Trip not found'], 404);
        }
        
        // Verify this trip belongs to the conductor
        $fullName = trim($userDetail->first_name . ' ' . $userDetail->last_name);
        $userName = $user->name;
        $firstName = $userDetail->first_name;
        $lastName = $userDetail->last_name;
        
        $isAuthorized = $trip->conductor_name === $fullName ||
                       $trip->conductor_name === $userName ||
                       strpos($trip->conductor_name, $firstName) !== false ||
                       strpos($trip->conductor_name, $lastName) !== false;
        
        if (!$isAuthorized) {
            return response()->json(['error' => 'Unauthorized to view this trip'], 403);
        }
        
        // Get bus information
        $bus = BusRegister::find($trip->bus_id);
        $total_seats = $bus ? $bus->total_seats : 0;
        
        // Get all bookings for this trip (both regular and guest bookings)
        $regularBookings = Booking::where('bus_id', $trip->bus_id)
            ->where('departure_date', $trip->departure_date)
            ->with('user')
            ->get();
            
        $guestBookings = GuestBooking::where('bus_id', $trip->bus_id)
            ->where('departure_date', $trip->departure_date)
            ->get();
        
        // Process regular bookings
        $processedBookings = [];
        foreach ($regularBookings as $booking) {
            $user = $booking->user;
            $userDetail = UserDetail::where('user_id', $user->id)->first();
            
            for ($i = 0; $i < $booking->reserved_tickets; $i++) {
                $processedBookings[] = [
                    'id' => $booking->id . '_' . $i,
                    'type' => 'regular',
                    'passenger_name' => $userDetail ? trim($userDetail->first_name . ' ' . $userDetail->last_name) : $user->name,
                    'phone' => $userDetail ? $userDetail->phone : 'N/A',
                    'email' => $user->email,
                    'amount' => $trip->price,
                    'status' => $booking->status,
                    'booking_date' => $booking->created_at,
                    'seat_number' => null, // We'll assign seat numbers later
                    'booking_reference' => $booking->id
                ];
            }
        }
        
        // Process guest bookings
        foreach ($guestBookings as $guestBooking) {
            for ($i = 0; $i < $guestBooking->reserved_tickets; $i++) {
                $processedBookings[] = [
                    'id' => 'guest_' . $guestBooking->id . '_' . $i,
                    'type' => 'guest',
                    'passenger_name' => $guestBooking->passenger_name,
                    'phone' => $guestBooking->phone,
                    'email' => $guestBooking->email,
                    'amount' => $trip->price,
                    'status' => strtolower($guestBooking->status),
                    'booking_date' => $guestBooking->created_at,
                    'seat_number' => null, // We'll assign seat numbers later
                    'booking_reference' => 'G' . $guestBooking->id
                ];
            }
        }
        
        // Calculate seat statistics
        $confirmed_count = 0;
        $pending_count = 0;
        $frozen_count = 0;
        
        foreach ($processedBookings as $booking) {
            switch ($booking['status']) {
                case 'confirmed':
                    $confirmed_count++;
                    break;
                case 'processing':
                case 'pending':
                    $pending_count++;
                    break;
                case 'freezed':
                case 'frozen':
                    $frozen_count++;
                    break;
            }
        }
        
        $available_seats = $total_seats - count($processedBookings);
        
        // Generate seat layout
        $seatLayout = [];
        $bookingIndex = 0;
        
        for ($i = 1; $i <= $total_seats; $i++) {
            $seat = [
                'number' => $i,
                'status' => 'available',
                'passenger' => null,
                'booking_id' => null
            ];
            
            if ($bookingIndex < count($processedBookings)) {
                $booking = $processedBookings[$bookingIndex];
                $seat['status'] = $booking['status'] === 'confirmed' ? 'booked' : 
                                ($booking['status'] === 'freezed' ? 'frozen' : 'pending');
                $seat['passenger'] = $booking['passenger_name'];
                $seat['booking_id'] = $booking['id'];
                
                // Update booking with seat number
                $processedBookings[$bookingIndex]['seat_number'] = $i;
                $bookingIndex++;
            }
            
            $seatLayout[] = $seat;
        }
        
        // Prepare response data
        $tripData = [
            'id' => $trip->id,
            'bus_no' => $trip->bus_no,
            'route' => $trip->start_point . ' → ' . $trip->end_point,
            'start_point' => $trip->start_point,
            'end_point' => $trip->end_point,
            'departure_date' => $trip->departure_date,
            'departure_time' => $trip->departure_time,
            'arrival_date' => $trip->arrival_date,
            'arrival_time' => $trip->arrival_time,
            'duration' => $trip->duration,
            'price' => $trip->price,
            'driver_name' => $trip->driver_name,
            'driver_contact' => $trip->driver_contact,
            'conductor_name' => $trip->conductor_name,
            'conductor_contact' => $trip->conductor_contact,
            'total_seats' => $total_seats,
            'booked_seats' => $confirmed_count,
            'pending_seats' => $pending_count,
            'frozen_seats' => $frozen_count,
            'available_seats' => $available_seats,
            'seat_layout' => $seatLayout,
            'bookings' => $processedBookings,
            'bus_details' => [
                'make' => $bus->brand ?? 'N/A',
                'model' => $bus->model ?? 'N/A',
                'registration' => $trip->bus_no,
                'capacity' => $total_seats,
                'amenities' => $bus->features ? explode(',', $bus->features) : ['Standard Seating']
            ]
        ];
        
        return response()->json([
            'success' => true,
            'trip' => $tripData
        ]);
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
