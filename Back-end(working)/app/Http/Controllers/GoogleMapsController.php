<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GoogleMapsController extends Controller
{
     public function getDirections(Request $request)
    {
        $origin = $request->query('origin');
        $destination = $request->query('destination');

        $apiKey = env('GOOGLE_MAPS_API_KEY'); // Store API key in .env
        $url = "https://maps.googleapis.com/maps/api/directions/json";

        $response = Http::withOptions([
            'verify' => storage_path('cacert.pem')
        ])->get($url, [
            'origin' => $origin,
            'destination' => $destination,
            'key' => $apiKey
        ]);

        return response()->json($response->json());
    }
}
