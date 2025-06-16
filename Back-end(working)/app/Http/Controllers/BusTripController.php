<?php

namespace App\Http\Controllers;

use App\Models\BusTrip;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\BusRegister;
use App\Models\Booking;

class BusTripController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $trips = BusTrip::all();
        $trips->transform(function ($trip) {
            $bus = BusRegister::find($trip->bus_id);
            $total_seats = $bus ? $bus->total_seats : 0;
            $booked_seats = 0;
            if ($trip->bus_id && $trip->departure_date) {
                $booked_seats = Booking::where('bus_id', $trip->bus_id)
                    ->where('departure_date', $trip->departure_date)
                    ->whereIn('status', ['confirmed', 'freezed'])
                    ->sum('reserved_tickets');
            }
            if ($booked_seats > 0) {
                $trip->available_seats = $total_seats - $booked_seats;
            } else {
                $trip->available_seats = $total_seats;
            }
            $trip->booked_seats = $booked_seats;
            return $trip;
        });
        return response()->json($trips);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'bus_id' => 'required|exists:bus_reg,id',
            'bus_no' => 'required|exists:bus_reg,bus_no',
            'driver_name' => 'required|string',
            'driver_contact' => 'required|string',
            'conductor_name' => 'required|string',
            'conductor_contact' => 'required|string',
            'start_point' => 'required|string',
            'end_point' => 'required|string',
            'departure_date' => 'required|date',
            'departure_time' => 'required',
            'price' => 'required|numeric',
            'available_seats' => 'required|integer',
            'arrival_date' => 'required|date',
            'arrival_time' => 'required',
        ]);

        $departure = Carbon::parse($validatedData['departure_date'] . ' ' . $validatedData['departure_time']);
        $arrival = Carbon::parse($validatedData['arrival_date'] . ' ' . $validatedData['arrival_time']);

        $durationFloat = $departure->floatDiffInHours($arrival);

        $hours = floor($durationFloat); // Get whole hours
        $minutes = round(($durationFloat - $hours) * 60); // Get remaining minutes

        $durationFormatted = "{$hours}h {$minutes}m";

        $validatedData['duration'] = $durationFormatted;
        // automatic calculation

        BusTrip::create($validatedData);

        return response()->json(['message' => 'Schedule created successfully']);
    }


    /**
     * Display the specified resource.
     */
    public function show(BusTrip $busTrip)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BusTrip $busTrip)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'bus_no' => 'required|string|max:255',
            'driver_name' => 'required|string|max:255',
            'driver_contact' => 'required|string|max:20',
            'conductor_name' => 'required|string|max:255',
            'conductor_contact' => 'required|string|max:20',
            'start_point' => 'required|string|max:255',
            'end_point' => 'required|string|max:255',
            'departure_date' => 'required|date',
            'departure_time' => 'required|string',
            'arrival_date' => 'required|date',
            'arrival_time' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $trip = BusTrip::findOrFail($id);

        $departure = Carbon::parse($request->departure_date . ' ' . $request->departure_time);
        $arrival = Carbon::parse($request->arrival_date . ' ' . $request->arrival_time);
        $durationFloat = $departure->floatDiffInHours($arrival);

        $hours = floor($durationFloat); // Get whole hours
        $minutes = round(($durationFloat - $hours) * 60); // Get remaining minutes

        $durationFormatted = "{$hours}h {$minutes}m";

        $validatedData['duration'] = $durationFormatted;
        // auto-calculate duration

        $trip->update([
            'bus_no' => $request->bus_no,
            'driver_name' => $request->driver_name,
            'driver_contact' => $request->driver_contact,
            'conductor_name' => $request->conductor_name,
            'conductor_contact' => $request->conductor_contact,
            'start_point' => $request->start_point,
            'end_point' => $request->end_point,
            'departure_date' => $request->departure_date,
            'departure_time' => $request->departure_time,
            'arrival_date' => $request->arrival_date,
            'arrival_time' => $request->arrival_time,
            'price' => $request->price,
            'duration' => $validatedData['duration'],
        ]);

        return response()->json(['message' => 'Schedule updated successfully.']);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $trip = BusTrip::findOrFail($id);
        $trip->delete();

        return response()->json(['message' => 'Schedule deleted successfully.']);
    }

}
