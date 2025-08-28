<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\UserDetail;
use App\Models\BusTrip;

echo "=== DEBUGGING CONDUCTOR TRIPS ===\n\n";

// Check conductors
echo "1. All Conductors:\n";
$conductors = User::where('role', 'Conductor')->get();
foreach($conductors as $conductor) {
    $userDetail = UserDetail::where('user_id', $conductor->id)->first();
    $firstName = $userDetail ? $userDetail->first_name : 'N/A';
    $lastName = $userDetail ? $userDetail->last_name : 'N/A';
    $fullName = trim($firstName . ' ' . $lastName);
    
    echo "  - ID: {$conductor->id}, Name: '{$conductor->name}', Email: {$conductor->email}\n";
    echo "    UserDetail: First: '{$firstName}', Last: '{$lastName}', Full: '{$fullName}'\n";
    
    // Check trips for this conductor
    $tripsByName = BusTrip::where('conductor_name', $conductor->name)->count();
    $tripsByFullName = BusTrip::where('conductor_name', $fullName)->count();
    echo "    Trips by name '{$conductor->name}': {$tripsByName}\n";
    echo "    Trips by full name '{$fullName}': {$tripsByFullName}\n\n";
}

// Check all unique conductor names in bus_trip table
echo "2. All Conductor Names in Bus Trips:\n";
$conductorNames = BusTrip::distinct()->pluck('conductor_name');
foreach($conductorNames as $name) {
    $count = BusTrip::where('conductor_name', $name)->count();
    echo "  - '{$name}': {$count} trips\n";
}

echo "\n=== END DEBUG ===\n";
