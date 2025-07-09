<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    // List all bookings
    public function index(Request $request)
    {
        $query = Booking::query();

        // Filter by user_id if provided
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by bus_no (bus_id) if provided
        if ($request->has('bus_no')) {
            $query->where('bus_id', $request->bus_no);
        }

        // Filter by departure_date if provided
        if ($request->has('departure_date')) {
            $query->where('departure_date', $request->departure_date);
        }

        $bookings = $query->get();

        // Ensure seat_no is always an array in the response
        $bookings->transform(function ($booking) {
            $booking->seat_no = is_string($booking->seat_no) ? explode(',', $booking->seat_no) : $booking->seat_no;
            return $booking;
        });

        return response()->json($bookings);
    }

    // Store a new booking
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'bus_id' => 'required|exists:bus_reg,id',
            'bus_no' => 'required|exists:bus_reg,bus_no',
            'serial_no' => 'required|string',
            'reserved_tickets' => 'required|integer',
            'seat_no' => 'required|string',
            'pickup' => 'required|string',
            'drop' => 'required|string',
            'payment_status' => 'required|string',
            'status' => 'required|string',
            'departure_date' => 'required|date',
            'reason' => 'nullable|string',
            'price' => 'nullable|numeric',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);
        $bus = \App\Models\BusRegister::findOrFail($request->bus_id);

        // Parse the departure date to ensure it's in the correct format
        try {
            // Parse the date using Carbon, which will handle many formats
            $departureDate = \Carbon\Carbon::parse($request->departure_date)->format('Y-m-d');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Invalid date format for departure_date. Please use YYYY-MM-DD format.',
                'error' => $e->getMessage()
            ], 422);
        }

        $booking = Booking::create([
            'user_id' => $user->id,
            'bus_id' => $bus->id,
            'bus_no' => $bus->bus_no,
            'serial_no' => $request->serial_no,
            'name' => $user->name,
            'reserved_tickets' => $request->reserved_tickets,
            'seat_no' => $request->seat_no,
            'pickup' => $request->pickup,
            'drop' => $request->drop,
            'role' => $user->role,
            'payment_status' => $request->payment_status,
            'status' => $request->status,
            'departure_date' => $departureDate,
            'booked_date' => now()->toDateString(),
            'reason' => $request->reason,
            'price' => $request->price ?? 0
        ]);

        return response()->json($booking, 201);
    }

    // Show a single booking
    public function show($id)
    {
        $booking = Booking::findOrFail($id);
        return response()->json($booking);
    }

    // Update a booking
    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update($request->all());
        return response()->json($booking);
    }

    // Update only the status of a booking

    public function updateStatus(Request $request)
    {
        \Log::info('updateStatus called', $request->all());
        $request->validate([
            'id' => 'required|exists:bookings,id',
            'status' => 'required|string',
            'payment_status' => 'nullable|string',
        ]);
        $booking = Booking::find($request->id);
        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }
        $booking->status = $request->status;
        if ($request->has('payment_status')) {
            $booking->payment_status = $request->payment_status;
        }
        $booking->save();
        return response()->json($booking);
    }

    // Delete a booking
    public function destroy($id)
    {
        Booking::destroy($id);
        return response()->json(null, 204);
    }
}
