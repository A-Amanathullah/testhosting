<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class ConductorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the Conductor role
        $conductorRole = Role::where('name', 'Conductor')->first();
        
        if (!$conductorRole) {
            $this->command->error('Conductor role not found. Please run RoleSeeder first.');
            return;
        }

        $conductors = [
            [
                'name' => 'John Perera',
                'email' => 'john.conductor@example.com',
                'first_name' => 'John',
                'last_name' => 'Perera',
                'phone_no' => '0771234567',
                'gender' => 'male',
            ],
            [
                'name' => 'Nimal Silva',
                'email' => 'nimal.conductor@example.com',
                'first_name' => 'Nimal',
                'last_name' => 'Silva',
                'phone_no' => '0772345678',
                'gender' => 'male',
            ],
            [
                'name' => 'Kamala Fernando',
                'email' => 'kamala.conductor@example.com',
                'first_name' => 'Kamala',
                'last_name' => 'Fernando',
                'phone_no' => '0773456789',
                'gender' => 'female',
            ],
            [
                'name' => 'Sunil Rajapaksha',
                'email' => 'sunil.conductor@example.com',
                'first_name' => 'Sunil',
                'last_name' => 'Rajapaksha',
                'phone_no' => '0774567890',
                'gender' => 'male',
            ],
            [
                'name' => 'Priyani Mendis',
                'email' => 'priyani.conductor@example.com',
                'first_name' => 'Priyani',
                'last_name' => 'Mendis',
                'phone_no' => '0775678901',
                'gender' => 'female',
            ]
        ];

        foreach ($conductors as $conductorData) {
            // Create user
            $user = User::create([
                'name' => $conductorData['name'],
                'email' => $conductorData['email'],
                'password' => Hash::make('password123'), // Default password
                'role' => 'Conductor',
                'role_id' => $conductorRole->id,
            ]);

            // Create user details
            UserDetail::create([
                'user_id' => $user->id,
                'first_name' => $conductorData['first_name'],
                'last_name' => $conductorData['last_name'],
                'phone_no' => $conductorData['phone_no'],
                'gender' => $conductorData['gender'],
                'email' => $conductorData['email'],
                'role' => 'Conductor',
            ]);

            $this->command->info("Created conductor: {$conductorData['name']}");
        }

        $this->command->info('Conductor seeder completed successfully!');
    }
}
