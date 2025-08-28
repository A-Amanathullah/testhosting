<?php

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

// Database connection
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'sqlite',
    'database' => __DIR__ . '/database/database.sqlite',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

echo "=== Debugging Conductor API ===\n\n";

// Step 1: Find the conductor user
echo "Step 1: Finding conductor 'sss tt'\n";
$conductorUser = Capsule::table('users')
    ->where('role', 'Conductor')
    ->whereExists(function ($query) {
        $query->select(Capsule::raw(1))
              ->from('user_details')
              ->whereRaw('user_details.user_id = users.id')
              ->where('first_name', 'sss')
              ->where('last_name', 'tt');
    })
    ->first();

if (!$conductorUser) {
    echo "❌ No conductor user found with name 'sss tt'\n";
    exit;
}

echo "✅ Found conductor user: ID {$conductorUser->id}, Email: {$conductorUser->email}\n";

// Step 2: Get user details
$userDetail = Capsule::table('user_details')->where('user_id', $conductorUser->id)->first();
if (!$userDetail) {
    echo "❌ No user details found\n";
    exit;
}

$fullName = trim($userDetail->first_name . ' ' . $userDetail->last_name);
echo "✅ Conductor full name: '$fullName'\n\n";

// Step 3: Search for trips with exact name match
echo "Step 2: Searching for trips with conductor_name = '$fullName'\n";
$exactTrips = Capsule::table('bus_trips')->where('conductor_name', $fullName)->get();
echo "Found " . count($exactTrips) . " trips with exact match\n";
foreach ($exactTrips as $trip) {
    echo "  - Trip ID: {$trip->id}, Bus: {$trip->bus_no}, Date: {$trip->departure_date}\n";
}
echo "\n";

// Step 4: Search for trips with partial name matches
echo "Step 3: Searching for trips with partial name matches\n";

// Search by first name
$firstNameTrips = Capsule::table('bus_trips')
    ->where('conductor_name', 'LIKE', '%' . $userDetail->first_name . '%')
    ->get();
echo "Found " . count($firstNameTrips) . " trips matching first name '{$userDetail->first_name}'\n";
foreach ($firstNameTrips as $trip) {
    echo "  - Trip ID: {$trip->id}, Conductor: '{$trip->conductor_name}', Bus: {$trip->bus_no}, Date: {$trip->departure_date}\n";
}
echo "\n";

// Step 5: Check all trip conductor names to see what's available
echo "Step 4: All unique conductor names in bus_trips:\n";
$allConductors = Capsule::table('bus_trips')
    ->select('conductor_name')
    ->distinct()
    ->get();
foreach ($allConductors as $conductor) {
    echo "  - '{$conductor->conductor_name}'\n";
}
echo "\n";

// Step 6: Test the actual API logic
echo "Step 5: Testing API logic\n";
$trips = Capsule::table('bus_trips')
    ->where(function ($query) use ($fullName, $userDetail) {
        $query->where('conductor_name', $fullName)
              ->orWhere('conductor_name', 'LIKE', '%' . $userDetail->first_name . '%')
              ->orWhere('conductor_name', 'LIKE', '%' . $userDetail->last_name . '%')
              ->orWhere('conductor_name', 'LIKE', '%' . $userDetail->first_name . ' ' . $userDetail->last_name . '%');
    })
    ->orderBy('departure_date', 'desc')
    ->get();

echo "API logic found " . count($trips) . " trips\n";
foreach ($trips as $trip) {
    echo "  - Trip ID: {$trip->id}, Conductor: '{$trip->conductor_name}', Bus: {$trip->bus_no}, Date: {$trip->departure_date}\n";
}

echo "\n=== Debug Complete ===\n";
