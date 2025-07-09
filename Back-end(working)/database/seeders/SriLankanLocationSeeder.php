<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SriLankanLocation;

class SriLankanLocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            // Western Province - Colombo District
            ['name' => 'Colombo', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'city', 'is_major_stop' => true],
            ['name' => 'Dehiwala', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Mount Lavinia', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Moratuwa', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Kesbewa', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town'],
            ['name' => 'Maharagama', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town'],
            ['name' => 'Kotte', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town'],
            
            // Western Province - Gampaha District
            ['name' => 'Gampaha', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Negombo', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'city', 'is_major_stop' => true],
            ['name' => 'Wattala', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town'],
            ['name' => 'Kadawatha', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town'],
            ['name' => 'Minuwangoda', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town'],
            
            // Western Province - Kalutara District  
            ['name' => 'Kalutara', 'district' => 'Kalutara', 'province' => 'Western', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Panadura', 'district' => 'Kalutara', 'province' => 'Western', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Horana', 'district' => 'Kalutara', 'province' => 'Western', 'type' => 'town'],
            ['name' => 'Beruwala', 'district' => 'Kalutara', 'province' => 'Western', 'type' => 'town'],
            
            // Eastern Province - Batticaloa District
            ['name' => 'Batticaloa', 'district' => 'Batticaloa', 'province' => 'Eastern', 'type' => 'city', 'is_major_stop' => true],
            ['name' => 'Kalmunai', 'district' => 'Batticaloa', 'province' => 'Eastern', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Sammanthurai', 'district' => 'Batticaloa', 'province' => 'Eastern', 'type' => 'town'],
            ['name' => 'Kattankudy', 'district' => 'Batticaloa', 'province' => 'Eastern', 'type' => 'town'],
            ['name' => 'Eravur', 'district' => 'Batticaloa', 'province' => 'Eastern', 'type' => 'town'],
            ['name' => 'Valaichenai', 'district' => 'Batticaloa', 'province' => 'Eastern', 'type' => 'town'],
            
            // Eastern Province - Ampara District
            ['name' => 'Ampara', 'district' => 'Ampara', 'province' => 'Eastern', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Akkaraipattu', 'district' => 'Ampara', 'province' => 'Eastern', 'type' => 'town'],
            ['name' => 'Pottuvil', 'district' => 'Ampara', 'province' => 'Eastern', 'type' => 'town'],
            ['name' => 'Monaragala', 'district' => 'Monaragala', 'province' => 'Uva', 'type' => 'town'],
            
            // Central Province
            ['name' => 'Kandy', 'district' => 'Kandy', 'province' => 'Central', 'type' => 'city', 'is_major_stop' => true],
            ['name' => 'Matale', 'district' => 'Matale', 'province' => 'Central', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Nuwara Eliya', 'district' => 'Nuwara Eliya', 'province' => 'Central', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Peradeniya', 'district' => 'Kandy', 'province' => 'Central', 'type' => 'town'],
            ['name' => 'Gampola', 'district' => 'Kandy', 'province' => 'Central', 'type' => 'town'],
            
            // Southern Province
            ['name' => 'Galle', 'district' => 'Galle', 'province' => 'Southern', 'type' => 'city', 'is_major_stop' => true],
            ['name' => 'Matara', 'district' => 'Matara', 'province' => 'Southern', 'type' => 'city', 'is_major_stop' => true],
            ['name' => 'Hambantota', 'district' => 'Hambantota', 'province' => 'Southern', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Hikkaduwa', 'district' => 'Galle', 'province' => 'Southern', 'type' => 'town'],
            ['name' => 'Unawatuna', 'district' => 'Galle', 'province' => 'Southern', 'type' => 'village'],
            ['name' => 'Tangalle', 'district' => 'Hambantota', 'province' => 'Southern', 'type' => 'town'],
            
            // North Western Province
            ['name' => 'Kurunegala', 'district' => 'Kurunegala', 'province' => 'North Western', 'type' => 'city', 'is_major_stop' => true],
            ['name' => 'Puttalam', 'district' => 'Puttalam', 'province' => 'North Western', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Chilaw', 'district' => 'Puttalam', 'province' => 'North Western', 'type' => 'town'],
            ['name' => 'Wariyapola', 'district' => 'Kurunegala', 'province' => 'North Western', 'type' => 'town'],
            
            // North Central Province
            ['name' => 'Anuradhapura', 'district' => 'Anuradhapura', 'province' => 'North Central', 'type' => 'city', 'is_major_stop' => true],
            ['name' => 'Polonnaruwa', 'district' => 'Polonnaruwa', 'province' => 'North Central', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Kekirawa', 'district' => 'Anuradhapura', 'province' => 'North Central', 'type' => 'town'],
            
            // Uva Province
            ['name' => 'Badulla', 'district' => 'Badulla', 'province' => 'Uva', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Bandarawela', 'district' => 'Badulla', 'province' => 'Uva', 'type' => 'town'],
            ['name' => 'Ella', 'district' => 'Badulla', 'province' => 'Uva', 'type' => 'town'],
            
            // Sabaragamuwa Province
            ['name' => 'Ratnapura', 'district' => 'Ratnapura', 'province' => 'Sabaragamuwa', 'type' => 'city', 'is_major_stop' => true],
            ['name' => 'Kegalle', 'district' => 'Kegalle', 'province' => 'Sabaragamuwa', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Embilipitiya', 'district' => 'Ratnapura', 'province' => 'Sabaragamuwa', 'type' => 'town'],
            
            // Northern Province (Limited due to current situation)
            ['name' => 'Jaffna', 'district' => 'Jaffna', 'province' => 'Northern', 'type' => 'city', 'is_major_stop' => true],
            ['name' => 'Vavuniya', 'district' => 'Vavuniya', 'province' => 'Northern', 'type' => 'town', 'is_major_stop' => true],
            ['name' => 'Mannar', 'district' => 'Mannar', 'province' => 'Northern', 'type' => 'town'],
            
            // Additional Eastern Province locations for Route 48 (Kalmunai-Colombo)
            ['name' => 'Nintavur', 'district' => 'Batticaloa', 'province' => 'Eastern', 'type' => 'town'],
            ['name' => 'Oluvil', 'district' => 'Batticaloa', 'province' => 'Eastern', 'type' => 'town'],
            ['name' => 'Maruthamunai', 'district' => 'Batticaloa', 'province' => 'Eastern', 'type' => 'village'],
            ['name' => 'Thirukkovil', 'district' => 'Batticaloa', 'province' => 'Eastern', 'type' => 'village'],
            
            // Additional stops along major routes
            ['name' => 'Moneragala', 'district' => 'Monaragala', 'province' => 'Uva', 'type' => 'town'],
            ['name' => 'Wellawaya', 'district' => 'Monaragala', 'province' => 'Uva', 'type' => 'town'],
            ['name' => 'Buttala', 'district' => 'Monaragala', 'province' => 'Uva', 'type' => 'town'],
            ['name' => 'Kataragama', 'district' => 'Monaragala', 'province' => 'Uva', 'type' => 'town'],
            ['name' => 'Tissamaharama', 'district' => 'Hambantota', 'province' => 'Southern', 'type' => 'town'],
        ];

        foreach ($locations as $location) {
            SriLankanLocation::create($location);
        }
    }
}
