<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Staff;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Staff::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string',
            'contact_number' => 'required|string',
            'nic_no' => 'required|string',
            'address' => 'required|string',
            'email' => 'required|email',
            'role' => 'required|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('profile_image')) {
            $imagePath = $request->file('profile_image')->store('profile_images', 'public');
            $validated['profile_image'] = $imagePath;
        }

        $staff = Staff::create($validated);
        return response()->json($staff, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Staff::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $staff = Staff::findOrFail($id);
        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'name' => 'sometimes|string',
            'contact_number' => 'sometimes|string',
            'nic_no' => 'sometimes|string',
            'address' => 'sometimes|string',
            'email' => 'sometimes|email',
            'role' => 'sometimes|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('profile_image')) {
            $imagePath = $request->file('profile_image')->store('profile_images', 'public');
            $validated['profile_image'] = $imagePath;
        }

        // Update related user if name, email, or role are present
        $user = $staff->user;
        $userUpdated = false;
        if (isset($validated['name'])) {
            $user->name = $validated['name'];
            $userUpdated = true;
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
            $userUpdated = true;
        }
        if (isset($validated['role'])) {
            $user->role = $validated['role'];
            $userUpdated = true;
        }
        if ($userUpdated) {
            $user->save();
        }

        $staff->update($validated);
        return response()->json($staff);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $staff = Staff::findOrFail($id);
        $userId = $staff->user_id;
        $staff->delete();
        // Only delete bookings and user for this specific userId
        \App\Models\Booking::where('user_id', $userId)->delete();
        \App\Models\User::where('id', $userId)->delete();
        return response()->json(['message' => 'Staff, user, and related bookings deleted successfully']);
    }
}
