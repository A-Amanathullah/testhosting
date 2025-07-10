<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\RouteStop;

class FixRoute extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fix-route';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix Route ID 7 by adding Colombo as the first stop';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Fixing Route ID 7: Adding Colombo as the first stop");
        
        // First, get all existing stops in reverse order and increment their order
        $existingStops = RouteStop::where('bus_route_id', 7)->orderBy('stop_order', 'desc')->get();
        
        // Update in reverse order to avoid unique constraint violations
        foreach ($existingStops as $stop) {
            $newOrder = $stop->stop_order + 1;
            $stop->stop_order = $newOrder;
            $stop->save();
            $this->info("Updated {$stop->stop_name} from order " . ($newOrder - 1) . " to {$newOrder}");
        }
        
        // Add Colombo as the first stop
        RouteStop::create([
            'bus_route_id' => 7,
            'stop_name' => 'Colombo',
            'stop_order' => 1,
            'duration_from_start' => 0,
            'fare_from_start' => 0.00
        ]);
        
        $this->info("Added Colombo as stop order 1");
        
        // Show the updated route
        $this->info("\nUpdated Route ID 7 stops:");
        $stops = RouteStop::where('bus_route_id', 7)->orderBy('stop_order')->get();
        foreach ($stops as $stop) {
            $this->line("  {$stop->stop_order}. {$stop->stop_name}");
        }
        
        $this->info("Route ID 7 has been fixed!");
    }
}
