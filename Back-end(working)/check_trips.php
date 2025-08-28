<?php

use App\Models\BusTrip;

echo "=== Checking specific trip IDs ===\n\n";

// Check trip IDs 77 and 76
$tripIds = [77, 76];

foreach ($tripIds as $tripId) {
    $trip = BusTrip::find($tripId);
    if ($trip) {
        echo "✅ Trip $tripId exists:\n";
        echo "   - Conductor: '{$trip->conductor_name}'\n";
        echo "   - Bus: {$trip->bus_no}\n";
        echo "   - Date: {$trip->departure_date}\n";
        echo "   - Route: {$trip->start_point} → {$trip->end_point}\n\n";
    } else {
        echo "❌ Trip $tripId not found\n\n";
    }
}

// Check if there are any trips with 'sss tt' (case insensitive)
echo "=== Searching for 'sss tt' (case insensitive) ===\n";
$sssTrips = BusTrip::whereRaw("LOWER(conductor_name) = ?", ['sss tt'])->get();
echo "Found " . $sssTrips->count() . " trips with 'sss tt'\n";
foreach ($sssTrips as $trip) {
    echo "   - Trip {$trip->id}: '{$trip->conductor_name}' - {$trip->bus_no} - {$trip->departure_date}\n";
}

echo "\n=== All recent trips (last 20) ===\n";
$recentTrips = BusTrip::orderBy('created_at', 'desc')->take(20)->get(['id', 'conductor_name', 'bus_no', 'departure_date', 'created_at']);
foreach ($recentTrips as $trip) {
    echo "Trip {$trip->id}: '{$trip->conductor_name}' - {$trip->bus_no} - {$trip->departure_date} (created: {$trip->created_at})\n";
}
