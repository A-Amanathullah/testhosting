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

    // List all cancellations
    public function index()
    {
        return Cancellation::all();
    }
}
