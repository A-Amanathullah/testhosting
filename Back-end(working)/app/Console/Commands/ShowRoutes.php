<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BusRoute;

class ShowRoutes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:show-routes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Show all bus routes and their stops';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $routes = BusRoute::with('routeStops')->get();
        
        foreach ($routes as $route) {
            $this->info("Route: {$route->route_name} (ID: {$route->id})");
            
            foreach ($route->routeStops->sortBy('stop_order') as $stop) {
                $this->line("  {$stop->stop_order}. {$stop->stop_name}");
            }
            
            $this->newLine();
        }
    }
}
