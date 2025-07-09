<?php

namespace App\Console\Commands;

use App\Models\SriLankanLocation;
use Illuminate\Console\Command;

class TestSriLankanLocationsApi extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'test:sri-lankan-locations';

    /**
     * The console command description.
     */
    protected $description = 'Test Sri Lankan locations functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Sri Lankan Locations...');
        
        // Test 1: Count total locations
        $totalCount = SriLankanLocation::count();
        $this->info("Total locations in database: {$totalCount}");
        
        // Test 2: Test search functionality
        $searchResults = SriLankanLocation::search('Colombo')->limit(5)->get();
        $this->info("Search results for 'Colombo': " . $searchResults->count());
        foreach ($searchResults as $location) {
            $this->line("  - {$location->name} ({$location->district}, {$location->province})");
        }
        
        // Test 3: Major stops
        $majorStops = SriLankanLocation::majorStops()->count();
        $this->info("Total major stops: {$majorStops}");
        
        // Test 4: Verified locations
        $verifiedCount = SriLankanLocation::verified()->count();
        $this->info("Verified locations: {$verifiedCount}");
        
        // Test 5: Districts
        $districts = SriLankanLocation::select('district')->distinct()->count();
        $this->info("Number of districts: {$districts}");
        
        // Test 6: Show some major stops
        $this->info("\nMajor stops:");
        $majorStopsList = SriLankanLocation::majorStops()->verified()->limit(10)->get();
        foreach ($majorStopsList as $stop) {
            $this->line("  - {$stop->name} ({$stop->type})");
        }
        
        $this->info("\n✅ API functionality test completed successfully!");
        
        return self::SUCCESS;
    }
}
