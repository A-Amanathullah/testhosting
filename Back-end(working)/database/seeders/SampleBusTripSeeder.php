<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusTrip;
use App\Models\BusRoute;
use App\Models\BusRegister;
use Carbon\Carbon;

class SampleBusTripSeeder extends Seeder
{
    public function run(): void
    {
        // Get routes
        $route48 = BusRoute::where('route_code', 'R48')->first();
        $route102 = BusRoute::where('route_code', 'R102')->first();
        $route1 = BusRoute::where('route_code', 'R1')->first();
        $route99 = BusRoute::where('route_code', 'R99')->first();

        // Get available buses from the database
        $buses = BusRegister::pluck('id')->toArray();
        
        // Check if we have enough buses
        if (count($buses) < 5) {
            $this->command->warn('Not enough buses in the database. Make sure BusRegSeeder has been run.');
            return;
        }

        $today = Carbon::today(); // 2025-07-08
        $tomorrow = Carbon::tomorrow(); // 2025-07-09
        $dayAfterTomorrow = Carbon::today()->addDays(2); // 2025-07-10

        // Clear existing trips to avoid duplicates
        BusTrip::truncate();

        $sampleTrips = [
            // Route 48: Batticaloa to Colombo - July 9th, 2025
            [
                'bus_id' => $buses[0] ?? null,
                'bus_no' => 'R48-001',
                'bus_route_id' => $route48?->id,
                'driver_name' => 'Mohamed Anwar',
                'driver_contact' => '0771234567',
                'conductor_name' => 'Ali Hassan',
                'conductor_contact' => '0777654321',
                'departure_date' => '2025-07-09',
                'departure_time' => '08:00:00',
                'arrival_date' => '2025-07-09',
                'arrival_time' => '14:00:00',
                'start_point' => 'Batticaloa',
                'end_point' => 'Colombo',
                'available_seats' => 45,
                'price' => 1200,
                'duration' => '6h 0m',
            ],
            
            // Route 48: Batticaloa to Colombo - July 9th, 2025 (Second trip)
            [
                'bus_id' => $buses[1] ?? null,
                'bus_no' => 'R48-002',
                'bus_route_id' => $route48?->id,
                'driver_name' => 'Kamal Perera',
                'driver_contact' => '0712345678',
                'conductor_name' => 'Ravi Silva',
                'conductor_contact' => '0778765432',
                'departure_date' => '2025-07-09',
                'departure_time' => '15:00:00',
                'arrival_date' => '2025-07-09',
                'arrival_time' => '21:00:00',
                'start_point' => 'Batticaloa',
                'end_point' => 'Colombo',
                'available_seats' => 40,
                'price' => 1200,
                'duration' => '6h 0m',
            ],

            // Route 102: Colombo to Kandy - July 8th, 2025 (different date)
            [
                'bus_id' => $buses[2] ?? null,
                'bus_no' => 'R102-001',
                'bus_route_id' => $route102?->id,
                'driver_name' => 'Sunil Fernando',
                'driver_contact' => '0723456789',
                'conductor_name' => 'Nimal Costa',
                'conductor_contact' => '0779876543',
                'departure_date' => '2025-07-08',
                'departure_time' => '09:00:00',
                'arrival_date' => '2025-07-08',
                'arrival_time' => '11:30:00',
                'start_point' => 'Colombo',
                'end_point' => 'Kandy',
                'available_seats' => 38,
                'price' => 480,
                'duration' => '2h 30m',
            ],

            // Route 1: Colombo to Galle - July 8th, 2025 (different date)
            [
                'bus_id' => $buses[3] ?? null,
                'bus_no' => 'R1-001',
                'bus_route_id' => $route1?->id,
                'driver_name' => 'Pradeep Jayawardana',
                'driver_contact' => '0734567890',
                'conductor_name' => 'Chamara Liyanage',
                'conductor_contact' => '0770987654',
                'departure_date' => '2025-07-08',
                'departure_time' => '10:15:00',
                'arrival_date' => '2025-07-08',
                'arrival_time' => '12:45:00',
                'start_point' => 'Colombo',
                'end_point' => 'Galle',
                'available_seats' => 42,
                'price' => 450,
                'duration' => '2h 30m',
            ],

            // Route 99: Colombo to Anuradhapura - July 10th, 2025 (different date)
            [
                'bus_id' => $buses[4] ?? null,
                'bus_no' => 'R99-001',
                'bus_route_id' => $route99?->id,
                'driver_name' => 'Ajith Bandara',
                'driver_contact' => '0745678901',
                'conductor_name' => 'Roshan Gunasekara',
                'conductor_contact' => '0771098765',
                'departure_date' => '2025-07-10',
                'departure_time' => '07:00:00',
                'arrival_date' => '2025-07-10',
                'arrival_time' => '11:00:00',
                'start_point' => 'Colombo',
                'end_point' => 'Anuradhapura',
                'available_seats' => 50,
                'price' => 800,
                'duration' => '4h 0m',
            ],
        ];

        foreach ($sampleTrips as $trip) {
            BusTrip::create($trip);
        }
    }
}
