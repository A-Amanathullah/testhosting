<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusRegister;

class BusRegSeeder extends Seeder
{
    public function run()
    {
        // Delete existing bus registrations
        BusRegister::truncate();

        // Create bus registrations
        $buses = [
            [
                'bus_no' => 'RS-001',
                'start_point' => 'Colombo',
                'end_point' => 'Kandy',
                'total_seats' => 45,
                'image' => null,
            ],
            [
                'bus_no' => 'RS-002',
                'start_point' => 'Colombo',
                'end_point' => 'Galle',
                'total_seats' => 50,
                'image' => null,
            ],
            [
                'bus_no' => 'RS-003',
                'start_point' => 'Kandy',
                'end_point' => 'Jaffna',
                'total_seats' => 40,
                'image' => null,
            ],
            [
                'bus_no' => 'RS-004',
                'start_point' => 'Colombo',
                'end_point' => 'Matara',
                'total_seats' => 48,
                'image' => null,
            ],
            [
                'bus_no' => 'RS-005',
                'start_point' => 'Kandy',
                'end_point' => 'Batticaloa',
                'total_seats' => 42,
                'image' => null,
            ],
            [
                'bus_no' => 'RS-006',
                'start_point' => 'Colombo',
                'end_point' => 'Trincomalee',
                'total_seats' => 46,
                'image' => null,
            ],
        ];

        foreach ($buses as $bus) {
            BusRegister::create($bus);
        }

        echo "Bus registrations created successfully!\n";
        echo "Created " . count($buses) . " bus registrations.\n";
    }
}
