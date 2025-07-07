<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LoyaltyCard;

class LoyaltyCardSeeder extends Seeder
{
    public function run(): void
    {
        $loyaltyCards = [
            [
                'tier' => 'Silver',
                'min_points' => 0,
                'max_points' => 999,
                'points_per_booking' => 10,
                'color' => '#C0C0C0',
            ],
            [
                'tier' => 'Gold',
                'min_points' => 1000,
                'max_points' => 4999,
                'points_per_booking' => 15,
                'color' => '#FFD700',
            ],
            [
                'tier' => 'Platinum',
                'min_points' => 5000,
                'max_points' => 9999,
                'points_per_booking' => 20,
                'color' => '#E5E4E2',
            ],
            [
                'tier' => 'Diamond',
                'min_points' => 10000,
                'max_points' => null, // No upper limit
                'points_per_booking' => 25,
                'color' => '#B9F2FF',
            ],
        ];

        foreach ($loyaltyCards as $cardData) {
            LoyaltyCard::firstOrCreate(
                ['tier' => $cardData['tier']],
                $cardData
            );
        }
    }
}
