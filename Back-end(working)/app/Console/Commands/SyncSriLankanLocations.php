<?php

namespace App\Console\Commands;

use App\Models\SriLankanLocation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncSriLankanLocations extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'sync:sri-lankan-locations {--limit=100} {--district=}';

    /**
     * The console command description.
     */
    protected $description = 'Sync Sri Lankan locations from OpenStreetMap';

    /**
     * Sri Lankan districts for comprehensive coverage
     */
    protected $districts = [
        'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
        'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
        'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
        'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
        'Monaragala', 'Ratnapura', 'Kegalle'
    ];

    /**
     * Province mapping for districts
     */
    protected $provinceMapping = [
        'Colombo' => 'Western', 'Gampaha' => 'Western', 'Kalutara' => 'Western',
        'Kandy' => 'Central', 'Matale' => 'Central', 'Nuwara Eliya' => 'Central',
        'Galle' => 'Southern', 'Matara' => 'Southern', 'Hambantota' => 'Southern',
        'Jaffna' => 'Northern', 'Kilinochchi' => 'Northern', 'Mannar' => 'Northern',
        'Vavuniya' => 'Northern', 'Mullaitivu' => 'Northern',
        'Batticaloa' => 'Eastern', 'Ampara' => 'Eastern', 'Trincomalee' => 'Eastern',
        'Kurunegala' => 'North Western', 'Puttalam' => 'North Western',
        'Anuradhapura' => 'North Central', 'Polonnaruwa' => 'North Central',
        'Badulla' => 'Uva', 'Monaragala' => 'Uva',
        'Ratnapura' => 'Sabaragamuwa', 'Kegalle' => 'Sabaragamuwa'
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $limit = $this->option('limit');
        $specificDistrict = $this->option('district');
        
        $this->info('Starting Sri Lankan locations sync from OpenStreetMap...');
        
        $districts = $specificDistrict ? [$specificDistrict] : $this->districts;
        $totalSynced = 0;
        $totalUpdated = 0;
        
        foreach ($districts as $district) {
            $this->info("Syncing locations for district: {$district}");
            
            try {
                $result = $this->syncDistrictLocations($district, $limit);
                $totalSynced += $result['synced'];
                $totalUpdated += $result['updated'];
                
                // Be respectful to OSM servers - add delay between requests
                sleep(2); // Increased delay to respect rate limits
                
            } catch (\Exception $e) {
                $this->error("Failed to sync {$district}: " . $e->getMessage());
                Log::error("OSM sync failed for {$district}: " . $e->getMessage());
                
                // Add delay even on failure to avoid hitting rate limits
                sleep(1);
            }
        }
        
        $this->info("Sync completed! Total synced: {$totalSynced}, Updated: {$totalUpdated}");
        
        return self::SUCCESS;
    }

    /**
     * Sync locations for a specific district
     */
    protected function syncDistrictLocations($district, $limit)
    {
        $synced = 0;
        $updated = 0;
        
        // Query OSM for locations in this district with proper headers
        $response = Http::timeout(30)
            ->withHeaders([
                'User-Agent' => 'Sri Lankan Bus Booking System/1.0 (Laravel App)',
                'Accept' => 'application/json',
                'Accept-Language' => 'en,si,ta',
            ])
            ->get('https://nominatim.openstreetmap.org/search', [
                'country' => 'Sri Lanka',
                'state' => $district,
                'format' => 'json',
                'addressdetails' => 1,
                'limit' => $limit,
                'extratags' => 1
            ]);
        
        if (!$response->successful()) {
            throw new \Exception("OSM API request failed with status: " . $response->status());
        }
        
        $locations = $response->json();
        
        foreach ($locations as $location) {
            try {
                $result = $this->processLocation($location, $district);
                if ($result === 'created') {
                    $synced++;
                } elseif ($result === 'updated') {
                    $updated++;
                }
            } catch (\Exception $e) {
                $this->warn("Failed to process location: " . $e->getMessage());
            }
        }
        
        return ['synced' => $synced, 'updated' => $updated];
    }

    /**
     * Process a single location from OSM
     */
    protected function processLocation($osmLocation, $district)
    {
        // Extract location data
        $name = $osmLocation['display_name'] ?? $osmLocation['name'] ?? null;
        $lat = $osmLocation['lat'] ?? null;
        $lon = $osmLocation['lon'] ?? null;
        
        if (!$name || !$lat || !$lon) {
            return 'skipped';
        }
        
        // Clean up the name - get the first part (actual location name)
        $cleanName = $this->cleanLocationName($name);
        
        if (strlen($cleanName) < 2) {
            return 'skipped';
        }
        
        // Determine location type
        $type = $this->determineLocationType($osmLocation);
        
        // Check if location already exists
        $existingLocation = SriLankanLocation::where('name', $cleanName)
            ->where('district', $district)
            ->first();
        
        $province = $this->provinceMapping[$district] ?? 'Unknown';
        
        $locationData = [
            'name' => $cleanName,
            'district' => $district,
            'province' => $province,
            'type' => $type,
            'latitude' => (float) $lat,
            'longitude' => (float) $lon,
            'data_source' => 'osm',
            'verified' => false,
            'last_verified_at' => now(),
            'is_major_stop' => $this->isMajorStop($osmLocation, $type)
        ];
        
        if ($existingLocation) {
            // Update existing location
            $existingLocation->update($locationData);
            return 'updated';
        } else {
            // Create new location
            SriLankanLocation::create($locationData);
            return 'created';
        }
    }

    /**
     * Clean location name from OSM display_name
     */
    protected function cleanLocationName($displayName)
    {
        // Split by comma and take the first part (actual location name)
        $parts = explode(',', $displayName);
        $name = trim($parts[0]);
        
        // Remove common prefixes/suffixes
        $name = preg_replace('/^(Village of|Town of|City of)\s+/i', '', $name);
        $name = preg_replace('/\s+(Village|Town|City)$/i', '', $name);
        
        return $name;
    }

    /**
     * Determine location type from OSM data
     */
    protected function determineLocationType($osmLocation)
    {
        $type = $osmLocation['type'] ?? '';
        $class = $osmLocation['class'] ?? '';
        $osmType = $osmLocation['osm_type'] ?? '';
        
        // Check for cities and major towns
        if (stripos($type, 'city') !== false || $class === 'place' && $type === 'city') {
            return 'city';
        }
        
        if (stripos($type, 'town') !== false || $class === 'place' && $type === 'town') {
            return 'town';
        }
        
        if (stripos($type, 'village') !== false || $class === 'place' && $type === 'village') {
            return 'village';
        }
        
        // Check for transport related locations
        if ($class === 'highway' || stripos($type, 'bus') !== false) {
            return 'bus_stop';
        }
        
        return 'village'; // Default
    }

    /**
     * Determine if location is a major stop
     */
    protected function isMajorStop($osmLocation, $type)
    {
        $name = $osmLocation['display_name'] ?? '';
        $class = $osmLocation['class'] ?? '';
        
        // Cities are major stops
        if ($type === 'city') {
            return true;
        }
        
        // Bus stations and terminals
        if ($class === 'highway' || stripos($name, 'bus') !== false || 
            stripos($name, 'terminal') !== false || stripos($name, 'station') !== false) {
            return true;
        }
        
        // Major towns
        $majorTowns = ['Kandy', 'Galle', 'Jaffna', 'Anuradhapura', 'Polonnaruwa', 
                       'Batticaloa', 'Trincomalee', 'Kurunegala', 'Ratnapura'];
        
        foreach ($majorTowns as $majorTown) {
            if (stripos($name, $majorTown) !== false) {
                return true;
            }
        }
        
        return false;
    }
}
