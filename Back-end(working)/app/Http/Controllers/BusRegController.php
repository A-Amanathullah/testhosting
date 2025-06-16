<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BusRegister;
use Illuminate\Support\Facades\Storage;

class BusRegController extends Controller
{

    public function index()
    {
        return response()->json(BusRegister::all());
    }
    public function store(Request $request)
{
    $request->validate([
        'bus_no' => 'required|string',
        'start_point' => 'required|string',
        'end_point' => 'required|string',
        'total_seats' => 'required|integer',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $photoPath = null;
    if ($request->hasFile('image')) {
        $photoPath = $request->file('image')->store('bus_photos', 'public');
    }

    $bus = BusRegister::create([
        'bus_no' => $request->bus_no,
        'start_point' => $request->start_point,
        'end_point' => $request->end_point,
        'total_seats' => $request->total_seats,
        'image' => $photoPath, // Save path to DB
    ]);

    return response()->json(['trip' => $bus], 201);
}


public function update(Request $request, $id)
{
    $request->validate([
        'bus_no' => 'required|string',
        'start_point' => 'required|string',
        'end_point' => 'required|string',
        'total_seats' => 'required|integer',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $bus = BusRegister::findOrFail($id);

    if ($request->hasFile('image')) {
        // Delete old image if exists
        if ($bus->image && Storage::disk('public')->exists($bus->image)) {
            Storage::disk('public')->delete($bus->image);
        }
        // Store new image
        $bus->image = $request->file('image')->store('bus_photos', 'public');
    }

    // Update other fields
    $bus->bus_no = $request->bus_no;
    $bus->start_point = $request->start_point;
    $bus->end_point = $request->end_point;
    $bus->total_seats = $request->total_seats;
    $bus->save();

    return response()->json(['message' => 'Bus updated successfully', 'bus' => $bus]);
}

public function destroy($id)
{
    $bus = BusRegister::findOrFail($id);
    $bus->delete();

    return response()->json(['message' => 'Bus deleted successfully']);
}

}
