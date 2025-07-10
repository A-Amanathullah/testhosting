<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BusTrip;

class CheckTrip extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-trip {date=2025-07-10}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check trip details for a specific date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = $this->argument('date');
        
        $trips = BusTrip::where('departure_date', $date)->with('busRoute')->get();
        
        $this->info("Trips on {$date}:");
        
        foreach ($trips as $trip) {
            $this->info("Trip ID: {$trip->id}");
            $this->info("Route ID: {$trip->bus_route_id}");
            $this->info("Route Name: " . ($trip->busRoute ? $trip->busRoute->route_name : 'N/A'));
            $this->info("Start Point: {$trip->start_point}");
            $this->info("End Point: {$trip->end_point}");
            $this->newLine();
        }
    }
}
