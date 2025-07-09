<?php

namespace App\Console\Commands;

use App\Models\SriLankanLocation;
use Illuminate\Console\Command;

class PopulateSriLankanLocations extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'populate:sri-lankan-locations {--reset}';

    /**
     * The console command description.
     */
    protected $description = 'Populate Sri Lankan locations with comprehensive data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('reset')) {
            $this->info('Clearing existing locations...');
            SriLankanLocation::truncate();
        }

        $this->info('Populating Sri Lankan locations...');
        
        $locations = $this->getComprehensiveLocationData();
        $created = 0;
        $updated = 0;
        
        foreach ($locations as $locationData) {
            $existing = SriLankanLocation::where('name', $locationData['name'])
                ->where('district', $locationData['district'])
                ->first();
            
            if ($existing) {
                $existing->update($locationData);
                $updated++;
            } else {
                SriLankanLocation::create($locationData);
                $created++;
            }
        }
        
        $this->info("Population completed! Created: {$created}, Updated: {$updated}");
        
        return self::SUCCESS;
    }

    /**
     * Get comprehensive Sri Lankan location data
     */
    protected function getComprehensiveLocationData()
    {
        return [
            // Western Province - Colombo District
            ['name' => 'Colombo', 'name_si' => 'කොළඹ', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'city', 'latitude' => 6.9271, 'longitude' => 79.8612, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Dehiwala', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.8560, 'longitude' => 79.8737, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Mount Lavinia', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.8390, 'longitude' => 79.8638, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Maharagama', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.8481, 'longitude' => 79.9269, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Kotte', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.8905, 'longitude' => 79.9071, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Moratuwa', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.7729, 'longitude' => 79.8819, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Boralesgamuwa', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.8418, 'longitude' => 79.9008, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Piliyandala', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.8009, 'longitude' => 79.9229, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Kesbewa', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.8154, 'longitude' => 79.9306, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Nugegoda', 'district' => 'Colombo', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.8649, 'longitude' => 79.8997, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Western Province - Gampaha District
            ['name' => 'Gampaha', 'name_si' => 'ගම්පහ', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town', 'latitude' => 7.0873, 'longitude' => 79.9999, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Negombo', 'name_si' => 'මීගමුව', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town', 'latitude' => 7.2083, 'longitude' => 79.8358, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Kiribathgoda', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.9789, 'longitude' => 79.9297, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Kadawatha', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.9934, 'longitude' => 79.9570, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Wattala', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.9889, 'longitude' => 79.8917, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Ja-Ela', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town', 'latitude' => 7.0745, 'longitude' => 79.8919, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Kelaniya', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.9553, 'longitude' => 79.9220, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Minuwangoda', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town', 'latitude' => 7.1669, 'longitude' => 79.9508, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Divulapitiya', 'district' => 'Gampaha', 'province' => 'Western', 'type' => 'town', 'latitude' => 7.2167, 'longitude' => 80.0167, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Western Province - Kalutara District
            ['name' => 'Kalutara', 'name_si' => 'කළුතර', 'district' => 'Kalutara', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.5854, 'longitude' => 79.9607, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Panadura', 'district' => 'Kalutara', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.7132, 'longitude' => 79.9026, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Horana', 'district' => 'Kalutara', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.7154, 'longitude' => 80.0630, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Beruwala', 'district' => 'Kalutara', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.4790, 'longitude' => 79.9827, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Aluthgama', 'district' => 'Kalutara', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.4267, 'longitude' => 79.9969, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Matugama', 'district' => 'Kalutara', 'province' => 'Western', 'type' => 'town', 'latitude' => 6.5347, 'longitude' => 80.1622, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Central Province - Kandy District
            ['name' => 'Kandy', 'name_si' => 'මහනුවර', 'district' => 'Kandy', 'province' => 'Central', 'type' => 'city', 'latitude' => 7.2906, 'longitude' => 80.6337, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Peradeniya', 'district' => 'Kandy', 'province' => 'Central', 'type' => 'town', 'latitude' => 7.2599, 'longitude' => 80.5977, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Gampola', 'district' => 'Kandy', 'province' => 'Central', 'type' => 'town', 'latitude' => 7.1650, 'longitude' => 80.5742, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Nawalapitiya', 'district' => 'Kandy', 'province' => 'Central', 'type' => 'town', 'latitude' => 7.0458, 'longitude' => 80.5335, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Kadugannawa', 'district' => 'Kandy', 'province' => 'Central', 'type' => 'town', 'latitude' => 7.2578, 'longitude' => 80.5242, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Central Province - Matale District
            ['name' => 'Matale', 'name_si' => 'මාතලේ', 'district' => 'Matale', 'province' => 'Central', 'type' => 'town', 'latitude' => 7.4675, 'longitude' => 80.6234, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Dambulla', 'district' => 'Matale', 'province' => 'Central', 'type' => 'town', 'latitude' => 7.8731, 'longitude' => 80.6511, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Sigiriya', 'district' => 'Matale', 'province' => 'Central', 'type' => 'village', 'latitude' => 7.9568, 'longitude' => 80.7600, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Central Province - Nuwara Eliya District
            ['name' => 'Nuwara Eliya', 'name_si' => 'නුවරඑළිය', 'district' => 'Nuwara Eliya', 'province' => 'Central', 'type' => 'town', 'latitude' => 6.9497, 'longitude' => 80.7891, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Hatton', 'district' => 'Nuwara Eliya', 'province' => 'Central', 'type' => 'town', 'latitude' => 6.8918, 'longitude' => 80.5951, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Talawakelle', 'district' => 'Nuwara Eliya', 'province' => 'Central', 'type' => 'town', 'latitude' => 6.9333, 'longitude' => 80.6500, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Southern Province - Galle District
            ['name' => 'Galle', 'name_si' => 'ගාල්ල', 'district' => 'Galle', 'province' => 'Southern', 'type' => 'city', 'latitude' => 6.0535, 'longitude' => 80.2210, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Hikkaduwa', 'district' => 'Galle', 'province' => 'Southern', 'type' => 'town', 'latitude' => 6.1410, 'longitude' => 80.1020, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Unawatuna', 'district' => 'Galle', 'province' => 'Southern', 'type' => 'village', 'latitude' => 6.0108, 'longitude' => 80.2495, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Bentota', 'district' => 'Galle', 'province' => 'Southern', 'type' => 'town', 'latitude' => 6.4258, 'longitude' => 79.9957, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Ambalangoda', 'district' => 'Galle', 'province' => 'Southern', 'type' => 'town', 'latitude' => 6.2350, 'longitude' => 80.0539, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Southern Province - Matara District
            ['name' => 'Matara', 'name_si' => 'මාතර', 'district' => 'Matara', 'province' => 'Southern', 'type' => 'town', 'latitude' => 5.9549, 'longitude' => 80.5550, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Mirissa', 'district' => 'Matara', 'province' => 'Southern', 'type' => 'village', 'latitude' => 5.9487, 'longitude' => 80.4565, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Weligama', 'district' => 'Matara', 'province' => 'Southern', 'type' => 'town', 'latitude' => 5.9754, 'longitude' => 80.4293, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Dickwella', 'district' => 'Matara', 'province' => 'Southern', 'type' => 'town', 'latitude' => 5.9667, 'longitude' => 80.5833, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Southern Province - Hambantota District
            ['name' => 'Hambantota', 'name_si' => 'හම්බන්තොට', 'district' => 'Hambantota', 'province' => 'Southern', 'type' => 'town', 'latitude' => 6.1241, 'longitude' => 81.1185, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Tangalle', 'district' => 'Hambantota', 'province' => 'Southern', 'type' => 'town', 'latitude' => 6.0244, 'longitude' => 80.7928, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Tissamaharama', 'district' => 'Hambantota', 'province' => 'Southern', 'type' => 'town', 'latitude' => 6.2833, 'longitude' => 81.2833, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Northern Province - Jaffna District
            ['name' => 'Jaffna', 'name_si' => 'යාපනය', 'name_ta' => 'யாழ்ப்பாணம்', 'district' => 'Jaffna', 'province' => 'Northern', 'type' => 'city', 'latitude' => 9.6615, 'longitude' => 80.0255, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Chavakachcheri', 'district' => 'Jaffna', 'province' => 'Northern', 'type' => 'town', 'latitude' => 9.6667, 'longitude' => 80.1667, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Point Pedro', 'district' => 'Jaffna', 'province' => 'Northern', 'type' => 'town', 'latitude' => 9.8167, 'longitude' => 80.2333, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Eastern Province - Batticaloa District
            ['name' => 'Batticaloa', 'name_si' => 'මඩකලපුව', 'name_ta' => 'மட்டக்களப்பு', 'district' => 'Batticaloa', 'province' => 'Eastern', 'type' => 'town', 'latitude' => 7.7102, 'longitude' => 81.6924, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Kalmunai', 'district' => 'Ampara', 'province' => 'Eastern', 'type' => 'town', 'latitude' => 7.4167, 'longitude' => 81.8167, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Eastern Province - Trincomalee District
            ['name' => 'Trincomalee', 'name_si' => 'ත්‍රිකුණාමලය', 'name_ta' => 'திருகோணமலை', 'district' => 'Trincomalee', 'province' => 'Eastern', 'type' => 'town', 'latitude' => 8.5874, 'longitude' => 81.2152, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],

            // North Western Province - Kurunegala District
            ['name' => 'Kurunegala', 'name_si' => 'කුරුණෑගල', 'district' => 'Kurunegala', 'province' => 'North Western', 'type' => 'town', 'latitude' => 7.4818, 'longitude' => 80.3609, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Chilaw', 'district' => 'Puttalam', 'province' => 'North Western', 'type' => 'town', 'latitude' => 7.5756, 'longitude' => 79.7951, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // North Central Province - Anuradhapura District
            ['name' => 'Anuradhapura', 'name_si' => 'අනුරාධපුරය', 'district' => 'Anuradhapura', 'province' => 'North Central', 'type' => 'city', 'latitude' => 8.3114, 'longitude' => 80.4037, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],

            // North Central Province - Polonnaruwa District
            ['name' => 'Polonnaruwa', 'name_si' => 'පොළොන්නරුව', 'district' => 'Polonnaruwa', 'province' => 'North Central', 'type' => 'town', 'latitude' => 7.9403, 'longitude' => 81.0188, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],

            // Uva Province - Badulla District
            ['name' => 'Badulla', 'name_si' => 'බදුල්ල', 'district' => 'Badulla', 'province' => 'Uva', 'type' => 'town', 'latitude' => 6.9895, 'longitude' => 81.0550, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Bandarawela', 'district' => 'Badulla', 'province' => 'Uva', 'type' => 'town', 'latitude' => 6.8326, 'longitude' => 80.9951, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Ella', 'district' => 'Badulla', 'province' => 'Uva', 'type' => 'village', 'latitude' => 6.8720, 'longitude' => 81.0467, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Sabaragamuwa Province - Ratnapura District
            ['name' => 'Ratnapura', 'name_si' => 'රත්නපුර', 'district' => 'Ratnapura', 'province' => 'Sabaragamuwa', 'type' => 'town', 'latitude' => 6.6828, 'longitude' => 80.4126, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Embilipitiya', 'district' => 'Ratnapura', 'province' => 'Sabaragamuwa', 'type' => 'town', 'latitude' => 6.3432, 'longitude' => 80.8504, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],

            // Sabaragamuwa Province - Kegalle District
            ['name' => 'Kegalle', 'name_si' => 'කෑගල්ල', 'district' => 'Kegalle', 'province' => 'Sabaragamuwa', 'type' => 'town', 'latitude' => 7.2513, 'longitude' => 80.3464, 'is_major_stop' => true, 'verified' => true, 'data_source' => 'manual'],
            ['name' => 'Mawanella', 'district' => 'Kegalle', 'province' => 'Sabaragamuwa', 'type' => 'town', 'latitude' => 7.2500, 'longitude' => 80.4500, 'is_major_stop' => false, 'verified' => true, 'data_source' => 'manual'],
        ];
    }
}
