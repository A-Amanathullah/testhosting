<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run()
    {
        // Create test admin user
        User::create([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Create test regular user
        User::create([
            'name' => 'Test User',
            'email' => 'user@test.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        // Create test agent
        User::create([
            'name' => 'Test Agent',
            'email' => 'agent@test.com',
            'password' => Hash::make('password123'),
            'role' => 'agent',
        ]);

        echo "Test users created successfully!\n";
        echo "Admin: admin@test.com / password123\n";
        echo "User: user@test.com / password123\n";
        echo "Agent: agent@test.com / password123\n";
    }
}
