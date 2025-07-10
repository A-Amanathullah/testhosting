<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Booking;
use App\Models\GuestBooking;
use App\Models\Cancellation;
use Carbon\Carbon;

class DashboardTestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample users with different roles
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'role' => 'admin'
            ]
        );

        $agent1 = User::firstOrCreate(
            ['email' => 'agent1@test.com'],
            [
                'name' => 'Arafat Travel Agency',
                'password' => bcrypt('password'),
                'role' => 'agent'
            ]
        );

        $agent2 = User::firstOrCreate(
            ['email' => 'agent2@test.com'],
            [
                'name' => 'Ceylon Tours',
                'password' => bcrypt('password'),
                'role' => 'agent'
            ]
        );

        $staff1 = User::firstOrCreate(
            ['email' => 'staff1@test.com'],
            [
                'name' => 'Staff Member 1',
                'password' => bcrypt('password'),
                'role' => 'staff'
            ]
        );

        $staff2 = User::firstOrCreate(
            ['email' => 'staff2@test.com'],
            [
                'name' => 'Staff Member 2',
                'password' => bcrypt('password'),
                'role' => 'manager'
            ]
        );

        $user = User::firstOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'Regular User',
                'password' => bcrypt('password'),
                'role' => 'user'
            ]
        );

        // Create today's bookings
        $today = Carbon::today();
        
        // User bookings for today
        for ($i = 1; $i <= 8; $i++) {
            Booking::create([
                'user_id' => $user->id,
                'bus_id' => 1,
                'bus_no' => 'BUS001',
                'serial_no' => 'S' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Customer ' . $i,
                'reserved_tickets' => rand(1, 4),
                'seat_no' => 'A' . $i,
                'pickup' => 'Colombo',
                'drop' => 'Kandy',
                'role' => 'user',
                'payment_status' => 'completed',
                'status' => 'confirmed',
                'departure_date' => $today->addDays(rand(1, 7)),
                'booked_date' => $today,
                'price' => rand(500, 2000),
            ]);
        }

        // Agent bookings for today
        for ($i = 1; $i <= 12; $i++) {
            Booking::create([
                'user_id' => $agent1->id,
                'bus_id' => 1,
                'bus_no' => 'BUS002',
                'serial_no' => 'A' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Agent Customer ' . $i,
                'reserved_tickets' => rand(1, 6),
                'seat_no' => 'B' . $i,
                'pickup' => 'Galle',
                'drop' => 'Colombo',
                'role' => 'agent',
                'payment_status' => 'completed',
                'status' => 'confirmed',
                'departure_date' => $today->addDays(rand(1, 7)),
                'booked_date' => $today,
                'price' => rand(800, 3000),
            ]);
        }

        // Guest bookings for today
        for ($i = 1; $i <= 6; $i++) {
            GuestBooking::create([
                'name' => 'Guest Customer ' . $i,
                'phone' => '077123456' . $i,
                'email' => 'guest' . $i . '@test.com',
                'bus_id' => 1,
                'bus_no' => 'BUS003',
                'serial_no' => 'G' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'reserved_tickets' => rand(1, 3),
                'seat_no' => 'C' . $i,
                'pickup' => 'Negombo',
                'drop' => 'Kandy',
                'departure_date' => $today->addDays(rand(1, 5)),
                'status' => 'confirmed',
                'payment_status' => 'completed',
                'agent_id' => $agent2->id,
                'price' => rand(600, 2500),
                'created_at' => $today,
                'updated_at' => $today,
            ]);
        }

        // Yesterday's bookings for comparison
        $yesterday = Carbon::yesterday();
        
        for ($i = 1; $i <= 5; $i++) {
            Booking::create([
                'user_id' => $user->id,
                'bus_id' => 1,
                'bus_no' => 'BUS001',
                'serial_no' => 'Y' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Yesterday Customer ' . $i,
                'reserved_tickets' => rand(1, 4),
                'seat_no' => 'D' . $i,
                'pickup' => 'Colombo',
                'drop' => 'Galle',
                'role' => 'user',
                'payment_status' => 'completed',
                'status' => 'confirmed',
                'departure_date' => $yesterday->addDays(rand(1, 7)),
                'booked_date' => $yesterday,
                'price' => rand(500, 2000),
            ]);
        }

        // Today's cancellations
        for ($i = 1; $i <= 3; $i++) {
            Cancellation::create([
                'user_id' => $user->id,
                'bus_id' => 1,
                'bus_no' => 'BUS001',
                'serial_no' => 'C' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Cancelled Customer ' . $i,
                'phone' => '077999888' . $i,
                'email' => 'cancel' . $i . '@test.com',
                'reserved_tickets' => rand(1, 2),
                'seat_no' => 'E' . $i,
                'pickup' => 'Colombo',
                'drop' => 'Kandy',
                'role' => 'user',
                'payment_status' => 'refunded',
                'status' => 'cancelled',
                'booking_type' => 'regular',
                'departure_date' => $today->addDays(rand(1, 5)),
                'booked_date' => $today->subDays(rand(1, 3)),
                'reason' => 'Customer request',
                'price' => rand(500, 1500),
                'created_at' => $today,
                'updated_at' => $today,
            ]);
        }

        // Yesterday's cancellations
        for ($i = 1; $i <= 5; $i++) {
            Cancellation::create([
                'user_id' => $user->id,
                'bus_id' => 1,
                'bus_no' => 'BUS001',
                'serial_no' => 'YC' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => 'Yesterday Cancelled ' . $i,
                'phone' => '077888777' . $i,
                'email' => 'ycancel' . $i . '@test.com',
                'reserved_tickets' => rand(1, 2),
                'seat_no' => 'F' . $i,
                'pickup' => 'Galle',
                'drop' => 'Colombo',
                'role' => 'user',
                'payment_status' => 'refunded',
                'status' => 'cancelled',
                'booking_type' => 'regular',
                'departure_date' => $yesterday->addDays(rand(1, 5)),
                'booked_date' => $yesterday->subDays(rand(1, 3)),
                'reason' => 'Weather conditions',
                'price' => rand(500, 1500),
                'created_at' => $yesterday,
                'updated_at' => $yesterday,
            ]);
        }

        $this->command->info('Dashboard test data seeded successfully!');
        $this->command->info('Today\'s bookings: ' . (8 + 12 + 6) . ' (Users: 8, Agent bookings: 12, Guest bookings: 6)');
        $this->command->info('Yesterday\'s bookings: 5');
        $this->command->info('Today\'s cancellations: 3');
        $this->command->info('Yesterday\'s cancellations: 5');
        $this->command->info('Agents: 2, Staff: 3 (including admin)');
    }
}
