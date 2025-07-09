<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Sync Sri Lankan locations daily at 2 AM
        $schedule->command('sync:sri-lankan-locations --limit=50')
            ->dailyAt('02:00')
            ->withoutOverlapping()
            ->onFailure(function () {
                // Log or notify about failure
                \Log::error('Sri Lankan locations sync failed');
            });
        
        // Weekly full sync with higher limit on Sundays at 1 AM
        $schedule->command('sync:sri-lankan-locations --limit=200')
            ->weeklyOn(0, '01:00') // Sunday at 1 AM
            ->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
