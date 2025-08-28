<?php

use App\Models\User;
use App\Models\UserDetail;
use App\Models\BusTrip;

echo "=== Debugging Conductor 'sss tt' ===\n\n";

// Find the conductor user
$user = User::where('role', 'Conductor')
    ->whereHas('userDetail', function($q) {
        $q->where('first_name', 'sss')->where('last_name', 'tt');
    })->first();

if (!$user) {
    echo "❌ No conductor user found with name 'sss tt'\n";
    exit;
}

echo "✅ Found conductor user: ID {$user->id}, Email: {$user->email}\n";

// Get user details
$detail = $user->userDetail;
$fullName = trim($detail->first_name . ' ' . $detail->last_name);
echo "✅ Conductor full name: '{$fullName}'\n\n";

// Search for trips with exact name match
echo "Searching for trips with conductor_name = '{$fullName}'\n";
$trips = BusTrip::where('conductor_name', $fullName)->get();
echo "Found " . $trips->count() . " trips with exact match\n\n";

// Let's also check all conductor names in bus_trips
echo "All unique conductor names in bus_trips:\n";
$allConductors = BusTrip::select('conductor_name')->distinct()->get();
foreach ($allConductors as $conductor) {
    echo "  - '{$conductor->conductor_name}'\n";
}
echo "\n";

// Test broader search
echo "Testing broader search patterns:\n";
$broadTrips = BusTrip::where(function($query) use ($fullName, $detail) {
    $query->where('conductor_name', $fullName)
          ->orWhere('conductor_name', 'LIKE', '%' . $detail->first_name . '%')
          ->orWhere('conductor_name', 'LIKE', '%' . $detail->last_name . '%');
})->get();

echo "Broader search found " . $broadTrips->count() . " trips\n";
foreach ($broadTrips as $trip) {
    echo "  - Trip ID: {$trip->id}, Conductor: '{$trip->conductor_name}', Bus: {$trip->bus_no}, Date: {$trip->departure_date}\n";
}
