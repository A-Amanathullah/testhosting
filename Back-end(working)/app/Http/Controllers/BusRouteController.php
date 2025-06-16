<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\BusRoute;

class BusRouteController extends Controller
{
    public function storeRouteViaBatticaloa()
    {
        $from = 'Akkaraipattu';
        $to = 'Colombo';
        $apiKey = env('GOOGLE_MAPS_API_KEY');

        $url = "https://maps.googleapis.com/maps/api/directions/json";
        $response = Http::get($url, [
            'origin' => $from,
            'destination' => $to,
            'mode' => 'transit',
            'key' => $apiKey
        ]);

        $data = $response->json();

        if (empty($data['routes'])) {
            return response()->json(['error' => 'No routes found'], 404);
        }

        $selectedRoute = null;

        foreach ($data['routes'] as $route) {
            foreach ($route['legs'][0]['steps'] as $step) {
                if (
                    isset($step['transit_details']) &&
                    (
                        str_contains(strtolower($step['transit_details']['departure_stop']['name']), 'batticaloa') ||
                        str_contains(strtolower($step['transit_details']['arrival_stop']['name']), 'batticaloa')
                    )
                ) {
                    $selectedRoute = $route;
                    break 2; // exit both loops
                }
            }
        }

        if (!$selectedRoute) {
            return response()->json(['error' => 'Route via Batticaloa not found'], 404);
        }

        // Extract stops
        $stops = [];
        foreach ($selectedRoute['legs'][0]['steps'] as $step) {
            if (isset($step['transit_details'])) {
                $stops[] = $step['transit_details']['departure_stop']['name'];
                $stops[] = $step['transit_details']['arrival_stop']['name'];
            }
        }

        $stops = array_values(array_unique($stops));

        // Save to DB
        BusRoute::create([
            'from' => $from,
            'to' => $to,
            'stops' => json_encode($stops), // Make sure 'stops' column is TEXT or JSON
        ]);

        return response()->json([
            'message' => 'Route via Batticaloa stored successfully',
            'stops' => $stops,
        ]);
    }
}
