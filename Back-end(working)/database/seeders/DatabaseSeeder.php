<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Base data seeders
            RoleSeeder::class,
            RolePermissionsSeeder::class,
            LoyaltyCardSeeder::class,
            
            // User data
            TestUserSeeder::class,

            // Agent commission
            AgentCommissionSeeder::class,

            // Bus and transportation data - note the sequence is important!
            BusRegSeeder::class,         // Must run before any trip seeders
            BusRouteSeeder::class,       // Must run before trip seeders
            // SampleBusTripSeeder::class,  // Sample bus trips for testing
            
            // Other system data
            SmsTemplateSeeder::class,
            SriLankanLocationSeeder::class,
            
            // Test data for dashboard (optional - comment out if not needed)
            DashboardTestDataSeeder::class,
            
            // Add any additional seeders here
        ]);

        echo "\nAll seeders completed successfully!\n";
        echo "Database has been seeded with:\n";
        echo "- Roles and permissions\n";
        echo "- Loyalty cards\n";
        echo "- Test users and user details\n";
        echo "- Bus registrations\n";
        echo "- Bus routes\n";
        echo "- Sample bus trips\n";
        echo "- SMS templates\n";
        echo "- Sri Lankan locations\n";
        echo "- Dashboard test data\n";
    }
}
