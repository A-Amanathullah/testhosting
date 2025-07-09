<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusRoute;
use App\Models\RouteStop;

class BusRouteSeeder extends Seeder
{
    public function run(): void
    {
        // Route 48: Kalmunai to Colombo Express
        $route48 = BusRoute::create([
            'route_code' => 'R48',
            'route_name' => 'Kalmunai-Colombo Express',
            'start_location' => 'Kalmunai',
            'end_location' => 'Colombo',
            'description' => 'Express service from Kalmunai to Colombo via Batticaloa and major towns',
            'is_active' => true,
        ]);

        // Route 48 stops with realistic timing and pricing
        $route48Stops = [
            ['stop_name' => 'Kalmunai', 'stop_order' => 1, 'distance_from_start' => 0, 'duration_from_start' => 0, 'fare_from_start' => 0],
            ['stop_name' => 'Sammanthurai', 'stop_order' => 2, 'distance_from_start' => 8, 'duration_from_start' => 15, 'fare_from_start' => 50],
            ['stop_name' => 'Kattankudy', 'stop_order' => 3, 'distance_from_start' => 15, 'duration_from_start' => 25, 'fare_from_start' => 80],
            ['stop_name' => 'Eravur', 'stop_order' => 4, 'distance_from_start' => 25, 'duration_from_start' => 40, 'fare_from_start' => 120],
            ['stop_name' => 'Batticaloa', 'stop_order' => 5, 'distance_from_start' => 35, 'duration_from_start' => 60, 'fare_from_start' => 180],
            ['stop_name' => 'Valaichenai', 'stop_order' => 6, 'distance_from_start' => 50, 'duration_from_start' => 90, 'fare_from_start' => 250],
            ['stop_name' => 'Polonnaruwa', 'stop_order' => 7, 'distance_from_start' => 120, 'duration_from_start' => 180, 'fare_from_start' => 450],
            ['stop_name' => 'Kekirawa', 'stop_order' => 8, 'distance_from_start' => 150, 'duration_from_start' => 220, 'fare_from_start' => 550],
            ['stop_name' => 'Kurunegala', 'stop_order' => 9, 'distance_from_start' => 200, 'duration_from_start' => 280, 'fare_from_start' => 750],
            ['stop_name' => 'Gampaha', 'stop_order' => 10, 'distance_from_start' => 250, 'duration_from_start' => 330, 'fare_from_start' => 950],
            ['stop_name' => 'Colombo', 'stop_order' => 11, 'distance_from_start' => 280, 'duration_from_start' => 360, 'fare_from_start' => 1200],
        ];

        foreach ($route48Stops as $stop) {
            RouteStop::create(array_merge($stop, ['bus_route_id' => $route48->id]));
        }

        // Route 102: Colombo to Kandy via Kegalle
        $route102 = BusRoute::create([
            'route_code' => 'R102',
            'route_name' => 'Colombo-Kandy Express',
            'start_location' => 'Colombo',
            'end_location' => 'Kandy',
            'description' => 'Express service from Colombo to Kandy via Kegalle',
            'is_active' => true,
        ]);

        $route102Stops = [
            ['stop_name' => 'Colombo', 'stop_order' => 1, 'distance_from_start' => 0, 'duration_from_start' => 0, 'fare_from_start' => 0],
            ['stop_name' => 'Maharagama', 'stop_order' => 2, 'distance_from_start' => 15, 'duration_from_start' => 25, 'fare_from_start' => 80],
            ['stop_name' => 'Horana', 'stop_order' => 3, 'distance_from_start' => 35, 'duration_from_start' => 50, 'fare_from_start' => 150],
            ['stop_name' => 'Kegalle', 'stop_order' => 4, 'distance_from_start' => 60, 'duration_from_start' => 80, 'fare_from_start' => 250],
            ['stop_name' => 'Mawanella', 'stop_order' => 5, 'distance_from_start' => 75, 'duration_from_start' => 100, 'fare_from_start' => 300],
            ['stop_name' => 'Peradeniya', 'stop_order' => 6, 'distance_from_start' => 105, 'duration_from_start' => 130, 'fare_from_start' => 420],
            ['stop_name' => 'Kandy', 'stop_order' => 7, 'distance_from_start' => 115, 'duration_from_start' => 150, 'fare_from_start' => 480],
        ];

        foreach ($route102Stops as $stop) {
            RouteStop::create(array_merge($stop, ['bus_route_id' => $route102->id]));
        }

        // Route 1: Colombo to Galle Coastal Route
        $route1 = BusRoute::create([
            'route_code' => 'R1',
            'route_name' => 'Colombo-Galle Coastal Express',
            'start_location' => 'Colombo',
            'end_location' => 'Galle',
            'description' => 'Coastal route from Colombo to Galle via Mount Lavinia and Kalutara',
            'is_active' => true,
        ]);

        $route1Stops = [
            ['stop_name' => 'Colombo', 'stop_order' => 1, 'distance_from_start' => 0, 'duration_from_start' => 0, 'fare_from_start' => 0],
            ['stop_name' => 'Mount Lavinia', 'stop_order' => 2, 'distance_from_start' => 12, 'duration_from_start' => 20, 'fare_from_start' => 60],
            ['stop_name' => 'Moratuwa', 'stop_order' => 3, 'distance_from_start' => 18, 'duration_from_start' => 30, 'fare_from_start' => 80],
            ['stop_name' => 'Panadura', 'stop_order' => 4, 'distance_from_start' => 27, 'duration_from_start' => 45, 'fare_from_start' => 120],
            ['stop_name' => 'Kalutara', 'stop_order' => 5, 'distance_from_start' => 42, 'duration_from_start' => 65, 'fare_from_start' => 180],
            ['stop_name' => 'Beruwala', 'stop_order' => 6, 'distance_from_start' => 60, 'duration_from_start' => 90, 'fare_from_start' => 250],
            ['stop_name' => 'Hikkaduwa', 'stop_order' => 7, 'distance_from_start' => 98, 'duration_from_start' => 130, 'fare_from_start' => 380],
            ['stop_name' => 'Galle', 'stop_order' => 8, 'distance_from_start' => 116, 'duration_from_start' => 150, 'fare_from_start' => 450],
        ];

        foreach ($route1Stops as $stop) {
            RouteStop::create(array_merge($stop, ['bus_route_id' => $route1->id]));
        }

        // Route 99: Colombo to Anuradhapura
        $route99 = BusRoute::create([
            'route_code' => 'R99',
            'route_name' => 'Colombo-Anuradhapura Express',
            'start_location' => 'Colombo',
            'end_location' => 'Anuradhapura',
            'description' => 'Express service from Colombo to Anuradhapura via Kurunegala',
            'is_active' => true,
        ]);

        $route99Stops = [
            ['stop_name' => 'Colombo', 'stop_order' => 1, 'distance_from_start' => 0, 'duration_from_start' => 0, 'fare_from_start' => 0],
            ['stop_name' => 'Gampaha', 'stop_order' => 2, 'distance_from_start' => 30, 'duration_from_start' => 45, 'fare_from_start' => 120],
            ['stop_name' => 'Minuwangoda', 'stop_order' => 3, 'distance_from_start' => 45, 'duration_from_start' => 65, 'fare_from_start' => 180],
            ['stop_name' => 'Kurunegala', 'stop_order' => 4, 'distance_from_start' => 105, 'duration_from_start' => 120, 'fare_from_start' => 420],
            ['stop_name' => 'Wariyapola', 'stop_order' => 5, 'distance_from_start' => 135, 'duration_from_start' => 150, 'fare_from_start' => 520],
            ['stop_name' => 'Kekirawa', 'stop_order' => 6, 'distance_from_start' => 160, 'duration_from_start' => 180, 'fare_from_start' => 620],
            ['stop_name' => 'Anuradhapura', 'stop_order' => 7, 'distance_from_start' => 205, 'duration_from_start' => 240, 'fare_from_start' => 800],
        ];

        foreach ($route99Stops as $stop) {
            RouteStop::create(array_merge($stop, ['bus_route_id' => $route99->id]));
        }
    }
}
