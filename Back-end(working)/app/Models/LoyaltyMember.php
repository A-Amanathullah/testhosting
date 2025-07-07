<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class LoyaltyMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'loyalty_card_id',
        'member_name',
        'card_number',
        'total_points',
        'card_type',
        'member_since',
        'last_updated',
        'is_active',
    ];

    protected $casts = [
        'member_since' => 'date',
        'last_updated' => 'datetime',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function loyaltyCard()
    {
        return $this->belongsTo(LoyaltyCard::class);
    }

    // Calculate points from bookings
    public function calculateTotalPoints()
    {
        $user = $this->user;
        if (!$user) return 0;

        // Get all confirmed bookings for this user
        $bookings = $user->bookings()->where('status', 'confirmed')->get();
        $totalPoints = 0;

        foreach ($bookings as $booking) {
            // Get the current loyalty card to determine points per booking
            $currentCard = $this->loyaltyCard;
            if ($currentCard && $currentCard->points_per_booking) {
                $totalPoints += $currentCard->points_per_booking * $booking->reserved_tickets;
            }
        }

        return $totalPoints;
    }

    // Update card type based on points
    public function updateCardType()
    {
        $allCards = LoyaltyCard::orderBy('min_points', 'asc')->get();
        
        foreach ($allCards as $card) {
            if ($this->total_points >= $card->min_points && 
                ($card->max_points === null || $this->total_points <= $card->max_points)) {
                
                $this->loyalty_card_id = $card->id;
                $this->card_type = $card->tier;
                $this->last_updated = now();
                $this->save();
                break;
            }
        }
    }

    // Recalculate and update points and card type
    public function refreshLoyaltyData()
    {
        $this->total_points = $this->calculateTotalPoints();
        $this->updateCardType();
    }

    // Generate unique card number
    public static function generateCardNumber()
    {
        do {
            $cardNumber = 'LC' . str_pad(mt_rand(1, 99999999), 8, '0', STR_PAD_LEFT);
        } while (self::where('card_number', $cardNumber)->exists());
        
        return $cardNumber;
    }

    // Create loyalty member for new user
    public static function createForUser($userId)
    {
        $user = User::find($userId);
        if (!$user) return null;

        // Get the Silver card (lowest tier) as default
        $silverCard = LoyaltyCard::orderBy('min_points', 'asc')->first();
        if (!$silverCard) return null;

        $member = self::create([
            'user_id' => $userId,
            'loyalty_card_id' => $silverCard->id,
            'member_name' => $user->name,
            'card_number' => self::generateCardNumber(),
            'total_points' => 0,
            'card_type' => $silverCard->tier,
            'member_since' => Carbon::now()->toDateString(),
            'is_active' => true,
        ]);

        // Calculate initial points if user has existing bookings
        $member->refreshLoyaltyData();

        return $member;
    }
}
