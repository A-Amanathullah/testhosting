<?php

namespace App\Services;

use App\Models\LoyaltyMember;
use App\Models\Booking;
use App\Models\User;
use App\Models\UserDetail;

class LoyaltyService
{
    /**
     * Update loyalty points when a booking is confirmed
     */
    public static function updatePointsForBooking(Booking $booking)
    {
        // Add debug logging
        \Log::info('LoyaltyService::updatePointsForBooking called', [
            'booking_id' => $booking->id ?? 'unknown',
            'status' => $booking->status ?? 'unknown',
            'user_id' => $booking->user_id ?? 'unknown'
        ]);

        // Check if booking object has required properties
        if (!isset($booking->status) || !isset($booking->user_id)) {
            \Log::error('Booking object missing required properties', [
                'booking' => $booking->toArray()
            ]);
            return;
        }

        // Only process for confirmed bookings
        if ($booking->status !== 'confirmed') {
            return;
        }

        // Check if user has loyalty membership
        $loyaltyMember = LoyaltyMember::where('user_id', $booking->user_id)->first();
        
        if (!$loyaltyMember) {
            // Check if user is eligible for loyalty membership (role = 'user')
            $userDetail = UserDetail::where('user_id', $booking->user_id)->first();
            if ($userDetail && $userDetail->role === 'user') {
                // Create loyalty membership for the user
                $loyaltyMember = LoyaltyMember::createForUser($booking->user_id);
            }
        }

        if ($loyaltyMember) {
            // Refresh loyalty data (recalculate points and update card type)
            $loyaltyMember->refreshLoyaltyData();
        }
    }

    /**
     * Create loyalty memberships for all eligible users
     */
    public static function createMembershipsForAllUsers()
    {
        $users = User::whereHas('userDetail', function($query) {
            $query->where('role', 'user');
        })
        ->whereNotIn('id', function($query) {
            $query->select('user_id')->from('loyalty_members');
        })
        ->get();

        $createdCount = 0;
        foreach ($users as $user) {
            $member = LoyaltyMember::createForUser($user->id);
            if ($member) {
                $createdCount++;
            }
        }

        return $createdCount;
    }

    /**
     * Refresh all loyalty data (useful for bulk updates)
     */
    public static function refreshAllLoyaltyData()
    {
        $members = LoyaltyMember::where('is_active', true)->get();
        
        foreach ($members as $member) {
            $member->refreshLoyaltyData();
        }

        return $members->count();
    }
}
