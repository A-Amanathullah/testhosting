<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\LoyaltyService;

class CreateLoyaltyMemberships extends Command
{
    protected $signature = 'loyalty:create-memberships';
    protected $description = 'Create loyalty memberships for all eligible users';

    public function handle()
    {
        $this->info('Creating loyalty memberships for all eligible users...');
        
        $createdCount = LoyaltyService::createMembershipsForAllUsers();
        
        $this->info("Successfully created {$createdCount} loyalty memberships.");
        
        return 0;
    }
}
