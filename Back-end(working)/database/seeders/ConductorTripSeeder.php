<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusTrip;

class ConductorTripSeeder extends Seeder
{
    public function run()
    {
        echo "Creating trips for conductor 'sss tt'...\n";
        
        // Create trip 1
        $trip1 = BusTrip::create([
            'bus_id' => 7,
            'bus_no' => 'DH-1223',
            'driver_name' => 'MOHAMED',
            'driver_contact' => '1234567890',
            'conductor_name' => 'sss tt',
            'conductor_contact' => '+94757380318',
            'departure_date' => '2025-09-26',
            'departure_time' => '16:00:00',
            'start_point' => 'Colombo',
            'end_point' => 'Kalmunai',
            'available_seats' => 44,
            'price' => 2450,
            'duration' => '12h 0m',
            'arrival_date' => '2025-09-27',
            'arrival_time' => '04:00:00',
            'bus_route_id' => 7,
        ]);

        // Create trip 2
        $trip2 = BusTrip::create([
            'bus_id' => 7,
            'bus_no' => 'DH-1223',
            'driver_name' => 'MOHAMED',
            'driver_contact' => '1234567890',
            'conductor_name' => 'sss tt',
            'conductor_contact' => '+94757380318',
            'departure_date' => '2025-09-24',
            'departure_time' => '16:00:00',
            'start_point' => 'Colombo',
            'end_point' => 'Kalmunai',
            'available_seats' => 44,
            'price' => 2450,
            'duration' => '12h 0m',
            'arrival_date' => '2025-09-25',
            'arrival_time' => '04:00:00',
            'bus_route_id' => 7,
        ]);

        echo "✅ Created trip {$trip1->id} for conductor 'sss tt'\n";
        echo "✅ Created trip {$trip2->id} for conductor 'sss tt'\n";
    }
}
