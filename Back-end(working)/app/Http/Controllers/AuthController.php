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

        // Create user in the users table
        $user = new User();
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        $user->password = bcrypt($validatedData['password']);
        $user->role = $validatedData['role'];
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
                    'role' => $user->role,
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
            'role' => $user->role,
            'first_name' => $userDetail ? $userDetail->first_name : null,
            'last_name' => $userDetail ? $userDetail->last_name : null,
            'phone_no' => $userDetail ? $userDetail->phone_no : null,
            'gender' => $userDetail ? $userDetail->gender : null,
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
                    'password' => bcrypt(str()->random(16)),
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
                'role' => $user->role,
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
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_no' => 'nullable|string|max:20',
            'gender' => 'nullable|in:male,female,other',
            'email' => 'required|string|email|max:255',
            'role' => 'required|string|in:user,admin,agent,staff,driver',
        ]);

        $userDetail = UserDetail::updateOrCreate(
            ['user_id' => $validatedData['user_id']],
            [
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'phone_no' => $validatedData['phone_no'] ?? $validatedData['contact_number'],
                'gender' => $validatedData['gender'],
                'email' => $validatedData['email'],
                'role' => $validatedData['role'],
            ]
        );

        // Update staff table if user is a staff
        $staff = \App\Models\Staff::where('user_id', $validatedData['user_id'])->first();
        if ($staff) {
            $staff->email = $validatedData['email'];
            $staff->role = $validatedData['role'];
            $staff->contact_number = $validatedData['phone_no'];
            $staff->save();
        }

        return response()->json([
            'message' => 'User details saved successfully',
            'user_detail' => $userDetail,
        ]);
    }

    public function index(Request $request)
{
    // Optionally, restrict to admin role
    if ($request->user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $users = User::with('userDetail')->get()->map(function ($user) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'first_name' => $user->userDetail ? $user->userDetail->first_name : null,
            'last_name' => $user->userDetail ? $user->userDetail->last_name : null,
            'phone_no' => $user->userDetail ? $user->userDetail->phone_no : null,
            'gender' => $user->userDetail ? $user->userDetail->gender : null,
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
    if (!\Hash::check($request->current_password, $user->password)) {
        return response()->json(['message' => 'Current password is incorrect'], 400);
    }
    $user->password = bcrypt($request->new_password);
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
}