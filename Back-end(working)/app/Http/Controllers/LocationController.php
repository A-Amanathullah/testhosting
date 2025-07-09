<?php

namespace App\Http\Controllers;

use App\Models\SriLankanLocation;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function searchLocations(Request $request)
    {
        $search = $request->get('search', '');
        $limit = $request->get('limit', 20);

        $locations = SriLankanLocation::search($search)
            ->orderBy('is_major_stop', 'desc')
            ->orderBy('name')
            ->limit($limit)
            ->get(['name', 'district', 'province', 'type']);

        return response()->json($locations);
    }

    public function getAllLocations()
    {
        $locations = SriLankanLocation::orderBy('is_major_stop', 'desc')
            ->orderBy('name')
            ->get(['name', 'district', 'province', 'type']);

        return response()->json($locations);
    }

    public function getMajorStops()
    {
        $locations = SriLankanLocation::majorStops()
            ->orderBy('name')
            ->get(['name', 'district', 'province']);

        return response()->json($locations);
    }
}
