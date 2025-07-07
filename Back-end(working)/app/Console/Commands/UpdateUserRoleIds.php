<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Role;

class UpdateUserRoleIds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:update-role-ids';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update existing users with role_id based on their current role string';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating user role_ids...');

        // Get all users who don't have role_id set but have a role string
        $users = User::whereNull('role_id')->whereNotNull('role')->get();

        $updated = 0;
        $skipped = 0;

        foreach ($users as $user) {
            // Find matching role
            $role = Role::where('name', $user->role)->first();
            
            if ($role) {
                $user->role_id = $role->id;
                $user->save();
                $updated++;
                $this->line("Updated user {$user->email} with role_id {$role->id} ({$role->name})");
            } else {
                $skipped++;
                $this->warn("Skipped user {$user->email} - role '{$user->role}' not found in roles table");
            }
        }

        $this->info("Update completed!");
        $this->info("Updated: {$updated} users");
        $this->info("Skipped: {$skipped} users");

        return Command::SUCCESS;
    }
}
