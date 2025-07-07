<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusTrip;
use App\Models\BusRegister;
use Carbon\Carbon;

class BusTripSeeder extends Seeder
{
    public function run()
    {
        // Delete existing bus trips
        BusTrip::truncate();

        // Get some bus registrations to reference
        $buses = BusRegister::all();
        
        if ($buses->isEmpty()) {
            echo "No buses found. Please run BusRegSeeder first.\n";
            return;
        }

        $trips = [];
        $today = Carbon::today();

        // Create trips for the next 30 days
        for ($i = 0; $i < 30; $i++) {
            $date = $today->copy()->addDays($i);
            
            foreach ($buses->take(3) as $index => $bus) { // Use first 3 buses for variety
                // Morning trip
                $departureTime = Carbon::createFromTime(6 + ($index * 2), 0); // 6:00, 8:00, 10:00
                $arrivalTime = $departureTime->copy()->addHours(4 + $index); // 4-6 hour journey
                
                $trips[] = [
                    'bus_id' => $bus->id,
                    'bus_no' => $bus->bus_no,
                    'driver_name' => $this->getRandomDriver(),
                    'driver_contact' => $this->getRandomContact(),
                    'conductor_name' => $this->getRandomConductor(),
                    'conductor_contact' => $this->getRandomContact(),
                    'departure_date' => $date->format('Y-m-d'),
                    'departure_time' => $departureTime->format('H:i:s'),
                    'arrival_date' => $date->format('Y-m-d'),
                    'arrival_time' => $arrivalTime->format('H:i:s'),
                    'start_point' => $bus->start_point,
                    'end_point' => $bus->end_point,
                    'available_seats' => $bus->total_seats - rand(5, 15), // Some seats already booked
                    'price' => $this->calculatePrice($bus->start_point, $bus->end_point),
                    'duration' => $this->calculateDuration($arrivalTime->diffInMinutes($departureTime)),
                ];

                // Evening trip
                $eveningDepartureTime = Carbon::createFromTime(14 + ($index * 2), 30); // 14:30, 16:30, 18:30
                $eveningArrivalTime = $eveningDepartureTime->copy()->addHours(4 + $index);
                
                $trips[] = [
                    'bus_id' => $bus->id,
                    'bus_no' => $bus->bus_no,
                    'driver_name' => $this->getRandomDriver(),
                    'driver_contact' => $this->getRandomContact(),
                    'conductor_name' => $this->getRandomConductor(),
                    'conductor_contact' => $this->getRandomContact(),
                    'departure_date' => $date->format('Y-m-d'),
                    'departure_time' => $eveningDepartureTime->format('H:i:s'),
                    'arrival_date' => $date->format('Y-m-d'),
                    'arrival_time' => $eveningArrivalTime->format('H:i:s'),
                    'start_point' => $bus->start_point,
                    'end_point' => $bus->end_point,
                    'available_seats' => $bus->total_seats - rand(3, 12),
                    'price' => $this->calculatePrice($bus->start_point, $bus->end_point),
                    'duration' => $this->calculateDuration($eveningArrivalTime->diffInMinutes($eveningDepartureTime)),
                ];
            }
        }

        // Insert all trips
        foreach ($trips as $trip) {
            BusTrip::create($trip);
        }

        echo "Bus trips created successfully!\n";
        echo "Created " . count($trips) . " bus trips for the next 30 days.\n";
    }

    private function getRandomDriver()
    {
        $drivers = [
            'Kamal Perera', 'Sunil Silva', 'Nimal Fernando', 'Bandula Jayasinghe',
            'Pradeep Kumar', 'Chaminda Rathnayake', 'Tilak Gunasekara', 'Roshan Mendis'
        ];
        return $drivers[array_rand($drivers)];
    }

    private function getRandomConductor()
    {
        $conductors = [
            'Ajith Perera', 'Ranjith Silva', 'Mahinda Fernando', 'Upul Jayasinghe',
            'Sampath Kumar', 'Lakmal Rathnayake', 'Janaka Gunasekara', 'Prasad Mendis'
        ];
        return $conductors[array_rand($conductors)];
    }

    private function getRandomContact()
    {
        return 770000000 + rand(100000, 999999);
    }

    private function calculatePrice($startPoint, $endPoint)
    {
        $prices = [
            'Colombo-Kandy' => 500,
            'Colombo-Galle' => 300,
            'Kandy-Jaffna' => 800,
            'Colombo-Matara' => 400,
            'Kandy-Batticaloa' => 600,
            'Colombo-Trincomalee' => 700,
        ];

        $route = $startPoint . '-' . $endPoint;
        return $prices[$route] ?? 500; // Default price
    }

    private function calculateDuration($minutes)
    {
        $hours = floor($minutes / 60);
        $mins = $minutes % 60;
        return sprintf('%dh %dm', $hours, $mins);
    }
}
