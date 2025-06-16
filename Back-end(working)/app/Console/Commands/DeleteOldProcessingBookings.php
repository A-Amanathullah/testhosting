<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use Carbon\Carbon;

class DeleteOldProcessingBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookings:delete-old-processing';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete bookings with status Processing older than 2 minutes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $cutoff = Carbon::now()->subMinutes(2);
        $bookings = Booking::where('status', 'Processing')
            ->where('created_at', '<', $cutoff)
            ->get();
        if ($bookings->isEmpty()) {
            \Log::info('DeleteOldProcessingBookings: No bookings found for deletion.');
        } else {
            foreach ($bookings as $booking) {
                \Log::info('DeleteOldProcessingBookings: Deleting booking ID: ' . $booking->id . ' created_at: ' . $booking->created_at);
            }
            $count = Booking::whereIn('id', $bookings->pluck('id'))->delete();
            \Log::info("DeleteOldProcessingBookings: Deleted $count old processing bookings.");
        }
    }
}
