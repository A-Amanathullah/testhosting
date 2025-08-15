<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyCard;
use Illuminate\Http\Request;

class LoyaltyCardController extends Controller
{
    // Get all cards
    public function index()
    {
        return response()->json(LoyaltyCard::all());
    }

    // Store a new card
    public function store(Request $request)
    {
        $data = $request->validate([
            'tier' => 'required|string|unique:loyalty_cards,tier',
            'min_points' => 'required|integer',
            'max_points' => 'required|integer',
            'points_per_booking' => 'nullable|integer',
            'color' => 'nullable|string',
        ]);
        $card = LoyaltyCard::create($data);
        return response()->json($card, 201);
    }

    // Show a single card
    public function show($id)
    {
        $card = LoyaltyCard::findOrFail($id);
        return response()->json($card);
    }

    // Update a card
    public function update(Request $request, $id)
    {
        $card = LoyaltyCard::findOrFail($id);
        $data = $request->validate([
            'tier' => 'sometimes|required|string|unique:loyalty_cards,tier,' . $id,
            'min_points' => 'sometimes|required|integer',
            'max_points' => 'sometimes|required|integer',
            'points_per_booking' => 'nullable|integer',
            'color' => 'nullable|string',
        ]);
        $card->update($data);

        // If points_per_booking was updated, refresh all members with this card
        if (array_key_exists('points_per_booking', $data)) {
            $members = $card->loyaltyMembers;
            foreach ($members as $member) {
                $member->refreshLoyaltyData();
            }
        }
        return response()->json($card);
    }

    // Delete a card
    public function destroy($id)
    {
        $card = LoyaltyCard::findOrFail($id);
        $card->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
