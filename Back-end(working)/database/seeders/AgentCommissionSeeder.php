<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AgentCommission;
use Illuminate\Database\Seeder;

class AgentCommissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all agents
        $agents = User::where('role', 'agent')->get();

        foreach ($agents as $agent) {
            // Check if commission already exists
            $existingCommission = AgentCommission::where('user_id', $agent->id)->first();
            
            if (!$existingCommission) {
                AgentCommission::create([
                    'user_id' => $agent->id,
                    'user_name' => $agent->name,
                    'user_role' => $agent->role,
                    'commission_type' => 'percentage',
                    'commission_value' => 10.00,
                    'is_active' => true,
                    'notes' => 'Default 10% commission initialized by seeder'
                ]);
            }
        }

        $this->command->info('Agent commissions seeded successfully!');
    }
}
