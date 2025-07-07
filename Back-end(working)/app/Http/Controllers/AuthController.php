<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:user,admin,agent,staff,driver',
        ]);

        // Find role by name for role_id
        $role = \App\Models\Role::where('name', $validatedData['role'])->first();

        // Create user in the users table
        $user = new User();
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        $user->password = $validatedData['password']; // Laravel will auto-hash due to 'hashed' cast
        $user->role = $validatedData['role']; // Keep string for backward compatibility
        $user->role_id = $role ? $role->id : null; // Set role_id if role exists
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if (!Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
                return response()->json(['message' => 'Invalid email or password'], 401);
            }

            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;
            // Store the new token in current_token (invalidate previous sessions)
            $user->current_token = $token;
            $user->save();

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRoleName(), // Use helper method for consistent role access
                    'role_id' => $user->role_id,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Something went wrong. Please try again later.',
            ], 500);
        }
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $userDetail = UserDetail::where('user_id', $user->id)->first();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->getRoleName(), // Use helper method for consistent role access
            'role_id' => $user->role_id,
            'first_name' => $userDetail ? $userDetail->first_name : null,
            'last_name' => $userDetail ? $userDetail->last_name : null,
            'phone_no' => $userDetail ? $userDetail->phone_no : null,
            'gender' => $userDetail ? $userDetail->gender : null,
            'nic_no' => $userDetail ? $userDetail->nic_no : null,
            'address' => $userDetail ? $userDetail->address : null,
            'profile_image' => $userDetail ? $userDetail->profile_image : null,
        ]);
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName() ?? 'Google User',
                    'password' => \Illuminate\Support\Str::random(16), // Laravel will auto-hash
                    'role' => 'user',
                ]
            );

            // Populate user_details table, but do NOT overwrite phone_no/gender if already set
            $nameParts = explode(' ', $googleUser->getName() ?? 'Google User');
            $userDetail = UserDetail::where('user_id', $user->id)->first();
            $data = [
                'first_name' => $nameParts[0] ?? 'Google',
                'last_name' => $nameParts[1] ?? 'User',
                'email' => $googleUser->getEmail(),
                'role' => $user->getRoleName(), // Use helper method for consistent role access
            ];
            if (!$userDetail) {
                $data['phone_no'] = null;
                $data['gender'] = null;
            } else {
                $data['phone_no'] = $userDetail->phone_no;
                $data['gender'] = $userDetail->gender;
            }
            UserDetail::updateOrCreate(
                ['user_id' => $user->id],
                $data
            );

            $token = $user->createToken('auth_token')->plainTextToken;
            $from = $request->query('from', '/');
            return redirect('http://localhost:3000/login?token=' . $token . '&from=' . urlencode($from));
        } catch (\Exception $e) {
            \Log::error('Google OAuth error: ' . $e->getMessage());
            return response()->json(['message' => 'Google authentication failed'], 500);
        }
    }

    public function storeUserDetails(Request $request)
    {
        // Get valid roles from the roles table (case-insensitive)
        $validRoles = \App\Models\Role::pluck('name')->map(function ($role) {
            return strtolower($role);
        })->toArray();
        $validRolesString = implode(',', $validRoles);

        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_no' => 'nullable|string|max:20',
            'gender' => 'nullable|in:male,female,other',
            'email' => 'required|string|email|max:255',
            'role' => 'nullable|string', // Make role optional for profile updates
            'nic_no' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Normalize role to match roles table (case-insensitive) only if role is provided
        if (isset($validatedData['role'])) {
            $role = \App\Models\Role::whereRaw('LOWER(name) = ?', [strtolower($validatedData['role'])])->first();
            if ($role) {
                $validatedData['role'] = $role->name; // Use the exact case from roles table
            }
        }

        // Handle profile image upload
        $profileImagePath = null;
        if ($request->hasFile('profile_image')) {
            $profileImagePath = $request->file('profile_image')->store('profile_images', 'public');
        }

        // Prepare update data
        $updateData = [
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'phone_no' => $validatedData['phone_no'] ?? null,
            'gender' => $validatedData['gender'],
            'email' => $validatedData['email'],
            'nic_no' => $validatedData['nic_no'] ?? null,
            'address' => $validatedData['address'] ?? null,
        ];

        // Only update role if it's provided (for admin updates)
        if (isset($validatedData['role'])) {
            $updateData['role'] = $validatedData['role'];
        }

        // Only update profile_image if a new file was uploaded
        if ($profileImagePath) {
            $updateData['profile_image'] = $profileImagePath;
        }

        $userDetail = UserDetail::updateOrCreate(
            ['user_id' => $validatedData['user_id']],
            $updateData
        );

        // Update the users table role and role_id to keep both tables in sync (only if role is provided)
        $user = User::find($validatedData['user_id']);
        if ($user && isset($validatedData['role'])) {
            // Find the role_id for the given role name (case-insensitive)
            $roleModel = \App\Models\Role::whereRaw('LOWER(name) = ?', [strtolower($validatedData['role'])])->first();
            
            $user->role = $validatedData['role']; // Keep for backward compatibility
            $user->role_id = $roleModel ? $roleModel->id : null; // Set role_id for new system
            $user->save();
        }

        // Update staff table if user is a staff (only if role is provided)
        if (isset($validatedData['role'])) {
            $staff = \App\Models\Staff::where('user_id', $validatedData['user_id'])->first();
            if ($staff) {
                $staff->email = $validatedData['email'];
                $staff->role = $validatedData['role'];
                $staff->contact_number = $validatedData['phone_no'];
                $staff->save();
            }
        }

        return response()->json([
            'message' => 'User details saved successfully',
            'user_detail' => $userDetail,
        ]);
    }

    public function index(Request $request)
{
    // Allow admin-like roles to access users (check both new and old role systems)
    $user = $request->user();
    $allowedRoles = ['Superadmin', 'Admin', 'Manager', 'admin', 'superadmin', 'manager'];
    
    $hasAccess = false;
    
    // Check role_id (new system)
    if ($user->roleModel && in_array($user->roleModel->name, $allowedRoles)) {
        $hasAccess = true;
    }
    // Check role string (old system)
    elseif ($user->role && in_array($user->role, $allowedRoles)) {
        $hasAccess = true;
    }
    
    if (!$hasAccess) {
        return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
    }

    $users = User::with('userDetail')->get()->map(function ($user) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->getRoleName(), // Use helper method for consistent role access
            'role_id' => $user->role_id,
            'first_name' => $user->userDetail ? $user->userDetail->first_name : null,
            'last_name' => $user->userDetail ? $user->userDetail->last_name : null,
            'phone_no' => $user->userDetail ? $user->userDetail->phone_no : null,
            'gender' => $user->userDetail ? $user->userDetail->gender : null,
            'nic_no' => $user->userDetail ? $user->userDetail->nic_no : null,
            'address' => $user->userDetail ? $user->userDetail->address : null,
            'profile_image' => $user->userDetail ? $user->userDetail->profile_image : null,
        ];
    });

    return response()->json($users);
}

// Change Password
public function changePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required',
        'new_password' => 'required|min:6|confirmed',
    ]);

    $user = $request->user();
    if (!Hash::check($request->current_password, $user->getAuthPassword())) {
        return response()->json(['message' => 'Current password is incorrect'], 400);
    }
    $user->password = $request->new_password; // Laravel will auto-hash due to 'hashed' cast
    $user->save();
    return response()->json(['message' => 'Password changed successfully']);
}

// Delete user and related user_details
public function destroyUser($id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }
    // Delete user details
    UserDetail::where('user_id', $id)->delete();
    // Optionally, delete from staff table if exists
    \App\Models\Staff::where('user_id', $id)->delete();
    $user->delete();
    return response()->json(['message' => 'User and related details deleted successfully']);
}

public function googleLogin(Request $request)
{
    try {
        $validated = $request->validate([
            'email' => 'required|string|email',
        ]);

        // Check if user exists
        $user = User::where('email', $validated['email'])->first();
        
        if (!$user) {
            // Find user role for role_id
            $userRole = \App\Models\Role::where('name', 'user')->first();
            
            // Auto-register new users from Google Sign-In
            // For Laravel 12, we need to use create method to properly handle the password hashing
            $user = User::create([
                'name' => explode('@', $validated['email'])[0], // Use part of email as name
                'email' => $validated['email'],
                'password' => \Illuminate\Support\Str::random(16), // Laravel will auto-hash
                'role' => 'user', // Default role (keep for backward compatibility)
                'role_id' => $userRole ? $userRole->id : null, // Set role_id if role exists
            ]);
            
            // Create empty user details
            $userDetail = new UserDetail();
            $userDetail->user_id = $user->id;
            $userDetail->first_name = '';
            $userDetail->last_name = '';
            $userDetail->phone = '';
            $userDetail->gender = '';
            $userDetail->save();
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
        
    } catch (ValidationException $e) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Something went wrong: ' . $e->getMessage(),
        ], 500);
    }
}
}