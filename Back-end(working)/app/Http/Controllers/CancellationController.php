<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Cancellation;
use Illuminate\Http\Request;

class CancellationController extends Controller
{
    // Cancel a booking: move to cancellations and delete from bookings
    public function cancel($id)
    {
        $booking = Booking::findOrFail($id);
        $cancellation = new Cancellation($booking->toArray());
        $cancellation->status = 'cancelled'; // Ensure status is set
        $cancellation->save();
        $booking->delete();
        return response()->json(['status' => 'success', 'message' => 'Booking cancelled and moved to cancellations.']);
    }

    // List cancellations, optionally filtered by user_id or agent_id
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        $agentId = $request->query('agent_id');
        $query = Cancellation::query();
        if ($userId && $agentId) {
            // For agents, get cancellations where user_id = userId OR agent_id = agentId
            $query->where(function($q) use ($userId, $agentId) {
                $q->where('user_id', $userId)
                  ->orWhere('agent_id', $agentId);
            });
        } elseif ($userId) {
            $query->where('user_id', $userId);
        } elseif ($agentId) {
            $query->where('agent_id', $agentId);
        }
        return $query->get();
    }
}
