<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BusRoute;
use App\Models\RouteStop;
use Illuminate\Support\Facades\DB;

class BusRouteController extends Controller
{
    /**
     * Get all bus routes with their stops
     */
    public function index()
    {
        try {
            $routes = BusRoute::with('routeStops')
                ->orderBy('route_name')
                ->get();
            
            $result = $routes->map(function ($route) {
                $stops = $route->routeStops->sortBy('stop_order')->map(function ($stop) {
                    return [
                        'id' => $stop->id,
                        'location_name' => $stop->stop_name,
                        'stop_order' => $stop->stop_order,
                        'distance_from_start' => $stop->distance_from_start ?? 0,
                        'duration_from_start' => $stop->duration_from_start ?? 0,
                        'fare_from_start' => $stop->fare_from_start ?? 0,
                    ];
                })->values();

                return [
                    'id' => $route->id,
                    'route_code' => $route->route_code,
                    'route_name' => $route->route_name,
                    'start_location' => $route->start_location,
                    'end_location' => $route->end_location,
                    'description' => $route->description ?? '',
                    'stops' => $stops,
                ];
            });

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch bus routes',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Get a specific bus route with its stops
     */
    public function show($id)
    {
        try {
            $route = BusRoute::with('routeStops')
                ->findOrFail($id);

            return response()->json([
                'id' => $route->id,
                'route_code' => $route->route_code,
                'route_name' => $route->route_name,
                'start_location' => $route->start_location,
                'end_location' => $route->end_location,
                'description' => $route->description ?? '',
                'stops' => $route->routeStops->map(function ($stop) {
                    return [
                        'id' => $stop->id,
                        'location_name' => $stop->stop_name,
                        'stop_order' => $stop->stop_order,
                        'distance_from_start' => $stop->distance_from_start ?? 0,
                        'duration_from_start' => $stop->duration_from_start ?? 0,
                        'fare_from_start' => $stop->fare_from_start ?? 0,
                    ];
                })->sortBy('stop_order')->values(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Bus route not found',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Store a new bus route
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'route_code' => 'nullable|string|max:20|unique:bus_routes,route_code',
                'route_name' => 'required|string|max:255',
                'start_location' => 'required|string|max:255',
                'end_location' => 'required|string|max:255',
                'description' => 'nullable|string',
                'stops' => 'array',
                'stops.*.stop_name' => 'required|string|max:255',
                'stops.*.stop_order' => 'required|integer|min:1',
                'stops.*.distance_from_start' => 'nullable|numeric|min:0',
                'stops.*.duration_from_start' => 'nullable|integer|min:0',
                'stops.*.fare_from_start' => 'nullable|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Generate route code if not provided
            $routeCode = $request->route_code;
            if (!$routeCode) {
                $routeCode = $this->generateUniqueRouteCode();
            }

            // Create the bus route
            $route = BusRoute::create([
                'route_code' => $routeCode,
                'route_name' => $request->route_name,
                'start_location' => $request->start_location,
                'end_location' => $request->end_location,
                'description' => $request->description,
            ]);

            // Add route stops if provided
            if ($request->has('stops') && is_array($request->stops)) {
                foreach ($request->stops as $stopData) {
                    RouteStop::create([
                        'bus_route_id' => $route->id,
                        'stop_name' => $stopData['stop_name'],
                        'stop_order' => $stopData['stop_order'],
                        'distance_from_start' => $stopData['distance_from_start'] ?? 0,
                        'duration_from_start' => $stopData['duration_from_start'] ?? 0,
                        'fare_from_start' => $stopData['fare_from_start'] ?? 0,
                    ]);
                }
            }

            DB::commit();

            // Return the created route with its stops
            $route = BusRoute::with('routeStops')->find($route->id);
            
            return response()->json([
                'message' => 'Bus route created successfully',
                'route' => [
                    'id' => $route->id,
                    'route_code' => $route->route_code,
                    'route_name' => $route->route_name,
                    'start_location' => $route->start_location,
                    'end_location' => $route->end_location,
                    'description' => $route->description ?? '',
                    'stops' => $route->routeStops->map(function ($stop) {
                        return [
                            'id' => $stop->id,
                            'location_name' => $stop->stop_name,
                            'stop_order' => $stop->stop_order,
                            'distance_from_start' => $stop->distance_from_start ?? 0,
                            'duration_from_start' => $stop->duration_from_start ?? 0,
                            'fare_from_start' => $stop->fare_from_start ?? 0,
                        ];
                    })->sortBy('stop_order')->values(),
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create bus route',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing bus route
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'route_code' => 'nullable|string|max:20|unique:bus_routes,route_code,' . $id,
                'route_name' => 'required|string|max:255',
                'start_location' => 'required|string|max:255',
                'end_location' => 'required|string|max:255',
                'description' => 'nullable|string',
                'stops' => 'array',
                'stops.*.id' => 'nullable|integer|exists:route_stops,id',
                'stops.*.stop_name' => 'required|string|max:255',
                'stops.*.stop_order' => 'required|integer|min:1',
                'stops.*.distance_from_start' => 'nullable|numeric|min:0',
                'stops.*.duration_from_start' => 'nullable|integer|min:0',
                'stops.*.fare_from_start' => 'nullable|numeric|min:0',
            ]);

            DB::beginTransaction();

            $route = BusRoute::findOrFail($id);

            // Update the bus route
            $route->update([
                'route_code' => $request->route_code ?: $route->route_code, // Keep existing if not provided
                'route_name' => $request->route_name,
                'start_location' => $request->start_location,
                'end_location' => $request->end_location,
                'description' => $request->description,
            ]);

            // Handle route stops if provided
            if ($request->has('stops') && is_array($request->stops)) {
                // Get existing stop IDs that should be kept
                $keepStopIds = collect($request->stops)
                    ->filter(function ($stop) {
                        return isset($stop['id']) && $stop['id'];
                    })
                    ->pluck('id')
                    ->toArray();

                // Delete stops that are not in the new list
                RouteStop::where('bus_route_id', $route->id)
                    ->whereNotIn('id', $keepStopIds)
                    ->delete();

                // Update or create stops
                foreach ($request->stops as $stopData) {
                    if (isset($stopData['id']) && $stopData['id']) {
                        // Update existing stop
                        RouteStop::where('id', $stopData['id'])
                            ->where('bus_route_id', $route->id)
                            ->update([
                                'stop_name' => $stopData['stop_name'],
                                'stop_order' => $stopData['stop_order'],
                                'distance_from_start' => $stopData['distance_from_start'] ?? 0,
                                'duration_from_start' => $stopData['duration_from_start'] ?? 0,
                                'fare_from_start' => $stopData['fare_from_start'] ?? 0,
                            ]);
                    } else {
                        // Create new stop
                        RouteStop::create([
                            'bus_route_id' => $route->id,
                            'stop_name' => $stopData['stop_name'],
                            'stop_order' => $stopData['stop_order'],
                            'distance_from_start' => $stopData['distance_from_start'] ?? 0,
                            'duration_from_start' => $stopData['duration_from_start'] ?? 0,
                            'fare_from_start' => $stopData['fare_from_start'] ?? 0,
                        ]);
                    }
                }
            }

            DB::commit();

            // Return the updated route with its stops
            $route = BusRoute::with('routeStops')->find($route->id);
            
            return response()->json([
                'message' => 'Bus route updated successfully',
                'route' => [
                    'id' => $route->id,
                    'route_code' => $route->route_code,
                    'route_name' => $route->route_name,
                    'start_location' => $route->start_location,
                    'end_location' => $route->end_location,
                    'description' => $route->description ?? '',
                    'stops' => $route->routeStops->map(function ($stop) {
                        return [
                            'id' => $stop->id,
                            'location_name' => $stop->stop_name,
                            'stop_order' => $stop->stop_order,
                            'distance_from_start' => $stop->distance_from_start ?? 0,
                            'duration_from_start' => $stop->duration_from_start ?? 0,
                            'fare_from_start' => $stop->fare_from_start ?? 0,
                        ];
                    })->sortBy('stop_order')->values(),
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to update bus route',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a bus route and its stops
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $route = BusRoute::findOrFail($id);

            // Delete all route stops first
            RouteStop::where('route_id', $route->id)->delete();

            // Delete the route
            $route->delete();

            DB::commit();

            return response()->json([
                'message' => 'Bus route deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to delete bus route',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate a unique route code
     */
    private function generateUniqueRouteCode()
    {
        do {
            // Generate route code like R001, R002, etc.
            $latestRoute = BusRoute::orderBy('id', 'desc')->first();
            $nextNumber = $latestRoute ? $latestRoute->id + 1 : 1;
            $routeCode = 'R' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        } while (BusRoute::where('route_code', $routeCode)->exists());

        return $routeCode;
    }
}
