<?php

require_once 'bootstrap/app.php';

use App\Models\BusTrip;
use App\Models\User;

echo "=== Checking MySQL Database ===\n\n";

// Get latest trips
echo "Latest 10 trips:\n";
$trips = BusTrip::latest('id')->take(10)->get(['id', 'conductor_name', 'bus_no', 'departure_date']);
foreach ($trips as $trip) {
    echo "Trip {$trip->id}: '{$trip->conductor_name}' - {$trip->bus_no} - {$trip->departure_date}\n";
}

echo "\n";

// Check for 'sss tt' conductor
echo "Searching for conductor 'sss tt':\n";
$conductorUser = User::where('role', 'Conductor')
    ->whereHas('userDetail', function($q) {
        $q->where('first_name', 'sss')->where('last_name', 'tt');
    })->first();

if ($conductorUser) {
    echo "✅ Found conductor user: {$conductorUser->email}\n";
    $fullName = trim($conductorUser->userDetail->first_name . ' ' . $conductorUser->userDetail->last_name);
    echo "Full name: '{$fullName}'\n";
    
    $conductorTrips = BusTrip::where('conductor_name', $fullName)->get(['id', 'bus_no', 'departure_date']);
    echo "Trips for this conductor: " . $conductorTrips->count() . "\n";
    foreach ($conductorTrips as $trip) {
        echo "  - Trip {$trip->id}: {$trip->bus_no} - {$trip->departure_date}\n";
    }
} else {
    echo "❌ Conductor not found\n";
}

// Check specific IDs that user mentioned
echo "\nChecking specific trip IDs (77, 76):\n";
foreach ([77, 76] as $id) {
    $trip = BusTrip::find($id);
    if ($trip) {
        echo "✅ Trip {$id}: '{$trip->conductor_name}' - {$trip->bus_no} - {$trip->departure_date}\n";
    } else {
        echo "❌ Trip {$id} not found\n";
    }
}
