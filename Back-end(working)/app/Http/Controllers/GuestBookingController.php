<?php

namespace App\Http\Controllers;

use App\Models\GuestBooking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GuestBookingController extends Controller
{
    // Store a new guest booking
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'bus_id' => 'required|integer',
            'bus_no' => 'required|string',
            'serial_no' => 'required|string',
            'reserved_tickets' => 'required|integer',
            'seat_no' => 'required|string',
            'pickup' => 'required|string',
            'drop' => 'required|string',
            'departure_date' => 'required|date',
            'reason' => 'nullable|string',
            'price' => 'required|numeric',
            'status' => 'required|string',
            'payment_status' => 'nullable|string',
            'agent_id' => [
                'nullable',
                'exists:users,id',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->where('role', 'agent');
                }),
            ],
        ]);
        
        $booking = GuestBooking::create($data);
        return response()->json($booking, 201);
    }

    // List guest bookings for a bus and date
    public function index(Request $request)
    {
        $bus_id = $request->query('bus_id');
        $bus_no = $request->query('bus_no');
        $date = $request->query('departure_date');
        
        $query = GuestBooking::query();
        
        // Support filtering by either bus_id or bus_no
        if ($bus_id) {
            $query->where('bus_id', $bus_id);
        } elseif ($bus_no) {
            $query->where('bus_no', $bus_no);
        }
        
        // Filter by date if provided
        if ($date) {
            $query->where('departure_date', $date);
        }
        
        return $query->get();
    }

    // Get bookings made by a specific agent
    public function getByAgent(Request $request, $agentId)
    {
        // First verify that the user is actually an agent
        $agent = User::where('id', $agentId)
                    ->where('role', 'agent')
                    ->first();
        
        if (!$agent) {
            return response()->json([
                'error' => 'Agent not found or user is not an agent'
            ], 404);
        }
        
        $bookings = GuestBooking::where('agent_id', $agentId)
            ->with('agent:id,name,email,role')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($bookings);
    }

    // Get all agents for dropdown/selection
    public function getAgents()
    {
        $agents = User::where('role', 'agent')
                     ->select('id', 'name', 'email')
                     ->orderBy('name')
                     ->get();
        
        return response()->json($agents);
    }

    // Update an existing guest booking
    public function update(Request $request, $id)
    {
        $booking = GuestBooking::findOrFail($id);
        
        $data = $request->validate([
            'name' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'email' => 'nullable|email',
            'bus_id' => 'sometimes|required|integer',
            'bus_no' => 'sometimes|required|string',
            'serial_no' => 'sometimes|required|string',
            'reserved_tickets' => 'sometimes|required|integer',
            'seat_no' => 'sometimes|required|string',
            'pickup' => 'sometimes|required|string',
            'drop' => 'sometimes|required|string',
            'departure_date' => 'sometimes|required|date',
            'reason' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
            'status' => 'sometimes|required|string',
            'payment_status' => 'nullable|string',
            'agent_id' => [
                'nullable',
                'exists:users,id',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->where('role', 'agent');
                }),
            ],
        ]);
        
        $booking->update($data);
        return response()->json($booking);
    }

    // Cancel a guest booking: move to cancellations and delete from guest_bookings
    public function cancel($id)
    {
        $guestBooking = GuestBooking::findOrFail($id);
        
        // Create cancellation record with guest booking data
        $cancellationData = [
            'user_id' => null,
            'bus_id' => $guestBooking->bus_id,
            'bus_no' => $guestBooking->bus_no,
            'serial_no' => $guestBooking->serial_no,
            'name' => $guestBooking->name,
            'phone' => $guestBooking->phone,
            'email' => $guestBooking->email,
            'agent_id' => $guestBooking->agent_id,
            'reserved_tickets' => $guestBooking->reserved_tickets,
            'seat_no' => $guestBooking->seat_no,
            'pickup' => $guestBooking->pickup,
            'drop' => $guestBooking->drop,
            'role' => 'guest',
            'payment_status' => $guestBooking->payment_status ?? 'Not Applicable',
            'status' => 'cancelled',
            'booking_type' => 'guest',
            'departure_date' => $guestBooking->departure_date,
            'booked_date' => $guestBooking->created_at->format('Y-m-d'), // Use creation date as booked date
            'reason' => $guestBooking->reason,
            'price' => $guestBooking->price,
        ];
        
        $cancellation = \App\Models\Cancellation::create($cancellationData);
        
        // Delete the guest booking
        $guestBooking->delete();
        
        return response()->json([
            'status' => 'success', 
            'message' => 'Guest booking cancelled and moved to cancellations.'
        ]);
    }

    // Delete a guest booking
    public function destroy($id)
    {
        $booking = GuestBooking::findOrFail($id);
        $booking->delete();
        
        return response()->json(['message' => 'Guest booking deleted successfully'], 200);
    }
}
