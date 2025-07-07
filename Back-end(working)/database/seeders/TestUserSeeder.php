<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run()
    {
        // Delete existing test users if they exist
        User::whereIn('email', ['admin@test.com', 'user@test.com', 'agent@test.com'])->delete();

        // Get roles for assignment
        $adminRole = Role::where('name', 'admin')->first();
        $userRole = Role::where('name', 'user')->first();
        $agentRole = Role::where('name', 'agent')->first();

        // Create test admin user
        $adminUser = User::create([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
            'role' => 'admin', // Keep string for backward compatibility
            'role_id' => $adminRole ? $adminRole->id : null, // Use role_id if role exists
        ]);

        // Create admin user details
        UserDetail::create([
            'user_id' => $adminUser->id,
            'first_name' => 'Test',
            'last_name' => 'Admin',
            'phone_no' => '+94771234567',
            'gender' => 'male',
            'email' => 'admin@test.com',
            'role' => 'admin',
        ]);

        // Create test regular user
        $regularUser = User::create([
            'name' => 'Test User',
            'email' => 'user@test.com',
            'password' => Hash::make('password123'),
            'role' => 'user', // Keep string for backward compatibility
            'role_id' => $userRole ? $userRole->id : null, // Use role_id if role exists
        ]);

        // Create regular user details
        UserDetail::create([
            'user_id' => $regularUser->id,
            'first_name' => 'Test',
            'last_name' => 'User',
            'phone_no' => '+94777654321',
            'gender' => 'female',
            'email' => 'user@test.com',
            'role' => 'user',
        ]);

        // Create test agent
        $agentUser = User::create([
            'name' => 'Test Agent',
            'email' => 'agent@test.com',
            'password' => Hash::make('password123'),
            'role' => 'agent', // Keep string for backward compatibility
            'role_id' => $agentRole ? $agentRole->id : null, // Use role_id if role exists
        ]);

        // Create agent user details
        UserDetail::create([
            'user_id' => $agentUser->id,
            'first_name' => 'Test',
            'last_name' => 'Agent',
            'phone_no' => '+94781122334',
            'gender' => 'male',
            'email' => 'agent@test.com',
            'role' => 'agent',
        ]);

        echo "Test users and user details created successfully!\n";
        echo "Admin: admin@test.com / password123\n";
        echo "User: user@test.com / password123\n";
        echo "Agent: agent@test.com / password123\n";
    }
}
