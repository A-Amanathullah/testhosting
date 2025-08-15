<?php

namespace App\Observers;

use App\Models\Booking;
use App\Models\LoyaltyMember;

class BookingObserver
{
    /**
     * Handle the Booking "updated" event.
     * Automatically refresh loyalty points when a booking is confirmed.
     */
    public function updated(Booking $booking)
    {
        // Only trigger if status changed to 'confirmed'
        if ($booking->isDirty('status') && strtolower($booking->status) === 'confirmed') {
            // Find loyalty member for this user
            $member = LoyaltyMember::where('user_id', $booking->user_id)->first();
            if ($member) {
                $member->refreshLoyaltyData();
            }
        }
    }
}
