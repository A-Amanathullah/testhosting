<?php

namespace App\Http\Controllers;

use App\Models\SriLankanLocation;
use Illuminate\Http\Request;

class SriLankanLocationController extends Controller
{
    /**
     * Get locations for autocomplete
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $limit = $request->get('limit', 20);
        $majorOnly = $request->get('major_only', false);
        
        if (strlen($query) < 2) {
            return response()->json([]);
        }
        
        $locations = SriLankanLocation::search($query)
            ->when($majorOnly, function ($q) {
                return $q->majorStops();
            })
            ->verified()
            ->limit($limit)
            ->orderBy('is_major_stop', 'desc')
            ->orderBy('name')
            ->get(['id', 'name', 'name_si', 'name_ta', 'district', 'province', 'type', 'is_major_stop']);
        
        return response()->json($locations);
    }

    /**
     * Get all districts
     */
    public function getDistricts()
    {
        $districts = SriLankanLocation::select('district')
            ->distinct()
            ->orderBy('district')
            ->pluck('district');
        
        return response()->json($districts);
    }

    /**
     * Get all provinces
     */
    public function getProvinces()
    {
        $provinces = SriLankanLocation::select('province')
            ->distinct()
            ->orderBy('province')
            ->pluck('province');
        
        return response()->json($provinces);
    }

    /**
     * Get locations by district
     */
    public function getByDistrict($district)
    {
        $locations = SriLankanLocation::where('district', $district)
            ->verified()
            ->orderBy('is_major_stop', 'desc')
            ->orderBy('name')
            ->get(['id', 'name', 'name_si', 'name_ta', 'type', 'is_major_stop']);
        
        return response()->json($locations);
    }

    /**
     * Get major stops only
     */
    public function getMajorStops()
    {
        $locations = SriLankanLocation::majorStops()
            ->verified()
            ->orderBy('name')
            ->get(['id', 'name', 'name_si', 'name_ta', 'district', 'province']);
        
        return response()->json($locations);
    }

    /**
     * Admin: Mark location as verified
     */
    public function verify($id)
    {
        $location = SriLankanLocation::findOrFail($id);
        $location->update([
            'verified' => true,
            'last_verified_at' => now()
        ]);
        
        return response()->json(['message' => 'Location verified successfully']);
    }

    /**
     * Admin: Add manual location
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'name_si' => 'nullable|string|max:255',
            'name_ta' => 'nullable|string|max:255',
            'district' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'type' => 'required|in:village,town,city,bus_stop',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_major_stop' => 'boolean'
        ]);
        
        $data['data_source'] = 'manual';
        $data['verified'] = true;
        $data['last_verified_at'] = now();
        
        $location = SriLankanLocation::create($data);
        
        return response()->json($location, 201);
    }

    /**
     * Admin: Update location
     */
    public function update(Request $request, $id)
    {
        $location = SriLankanLocation::findOrFail($id);
        
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'name_si' => 'nullable|string|max:255',
            'name_ta' => 'nullable|string|max:255',
            'district' => 'sometimes|required|string|max:100',
            'province' => 'sometimes|required|string|max:100',
            'type' => 'sometimes|required|in:village,town,city,bus_stop',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_major_stop' => 'boolean',
            'verified' => 'boolean'
        ]);
        
        if (isset($data['verified']) && $data['verified']) {
            $data['last_verified_at'] = now();
        }
        
        $location->update($data);
        
        return response()->json($location);
    }

    /**
     * Admin: Get sync statistics
     */
    public function getSyncStats()
    {
        $stats = [
            'total_locations' => SriLankanLocation::count(),
            'verified_locations' => SriLankanLocation::verified()->count(),
            'major_stops' => SriLankanLocation::majorStops()->count(),
            'by_source' => SriLankanLocation::selectRaw('data_source, COUNT(*) as count')
                ->groupBy('data_source')
                ->pluck('count', 'data_source'),
            'by_type' => SriLankanLocation::selectRaw('type, COUNT(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type'),
            'last_sync' => SriLankanLocation::where('data_source', 'osm')
                ->latest('last_verified_at')
                ->value('last_verified_at')
        ];
        
        return response()->json($stats);
    }
}
