<?php

namespace App\Observers;

use App\Models\User;
use App\Models\LoyaltyMember;

class UserObserver
{
    /**
     * Handle the User "created" event.
     * Automatically create a LoyaltyMember for new users with role 'user'.
     */
    public function created(User $user)
    {
        // Check if user is eligible for loyalty
        $isUserRole = false;
        if ($user->roleModel && $user->roleModel->name === 'user') {
            $isUserRole = true;
        } elseif ($user->userDetail && $user->userDetail->role === 'user') {
            $isUserRole = true;
        } elseif ($user->role === 'user') {
            $isUserRole = true;
        }
        if ($isUserRole) {
            // Only create if not already a member
            if (!LoyaltyMember::where('user_id', $user->id)->exists()) {
                LoyaltyMember::createForUser($user->id);
            }
        }
    }
}
