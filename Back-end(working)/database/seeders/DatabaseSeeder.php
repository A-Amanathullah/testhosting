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
            RoleSeeder::class,
            RolePermissionsSeeder::class,
            LoyaltyCardSeeder::class,
            TestUserSeeder::class,
            BusRegSeeder::class,
            BusTripSeeder::class,
            SmsTemplateSeeder::class,
        ]);

        echo "\nAll seeders completed successfully!\n";
        echo "Database has been seeded with:\n";
        echo "- Roles and permissions\n";
        echo "- Loyalty cards\n";
        echo "- Test users and user details\n";
        echo "- Bus registrations\n";
        echo "- Bus trips\n";
        echo "- SMS templates\n";
    }
}
