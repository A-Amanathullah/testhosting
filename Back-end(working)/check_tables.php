<?php

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

// Database connection
$capsule = new Capsule;
$capsule->addConnection([
    'driver'    => 'sqlite',
    'database'  => __DIR__ . '/database/database.sqlite',
    'prefix'    => '',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

echo "=== CHECKING DATABASE TABLES ===\n";

try {
    // Get all table names
    $tables = Capsule::select("SELECT name FROM sqlite_master WHERE type='table'");
    
    echo "Available tables:\n";
    foreach ($tables as $table) {
        echo "- {$table->name}\n";
    }
    
    echo "\n=== CHECKING ROUTE-RELATED TABLES ===\n";
    
    // Check bus_routes table
    if (Capsule::schema()->hasTable('bus_routes')) {
        $routeCount = Capsule::table('bus_routes')->count();
        echo "bus_routes table exists with $routeCount records\n";
        
        // Show some routes
        $routes = Capsule::table('bus_routes')->limit(5)->get();
        foreach ($routes as $route) {
            echo "  Route: {$route->route_name} (ID: {$route->id})\n";
        }
    }
    
    // Check route_stops or similar table
    $routeStopTables = ['route_stops', 'bus_route_stops', 'stops', 'bus_stops'];
    foreach ($routeStopTables as $tableName) {
        if (Capsule::schema()->hasTable($tableName)) {
            $count = Capsule::table($tableName)->count();
            echo "\n$tableName table exists with $count records\n";
            
            // Show some stops
            $stops = Capsule::table($tableName)->limit(10)->get();
            foreach ($stops as $stop) {
                echo "  Stop: ";
                foreach ($stop as $key => $value) {
                    echo "$key: $value, ";
                }
                echo "\n";
            }
            break;
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n=== TABLE CHECK COMPLETE ===\n";
