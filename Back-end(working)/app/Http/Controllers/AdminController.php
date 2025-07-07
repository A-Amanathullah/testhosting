<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminController extends Controller
{
    public function createUser(Request $request)
{
    // Get valid roles from the roles table (case-insensitive)
    $validRoles = \App\Models\Role::pluck('name')->map(function ($role) {
        return strtolower($role);
    })->toArray();
    $validRolesString = implode(',', $validRoles);

    $validated = $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:6',
        'role' => "required|in:{$validRolesString}", // Dynamic validation against roles table
    ]);

    // Find the role_id for the given role name (case-insensitive)
    $role = \App\Models\Role::whereRaw('LOWER(name) = ?', [strtolower($validated['role'])])->first();

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'role' => $validated['role'], // Keep for backward compatibility
        'role_id' => $role ? $role->id : null, // Set role_id for new system
    ]);

    return response()->json(['message' => 'User created', 'user' => $user]);
}

}
