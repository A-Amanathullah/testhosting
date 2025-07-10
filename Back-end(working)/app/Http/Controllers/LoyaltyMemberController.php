<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyMember;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\LoyaltyCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoyaltyMemberController extends Controller
{
    // Get all loyalty members
    public function index()
    {
        $members = LoyaltyMember::with(['user', 'loyaltyCard'])
            ->orderBy('total_points', 'desc')
            ->paginate(20);
        
        return response()->json($members);
    }

    // Get a specific loyalty member
    public function show($id)
    {
        $member = LoyaltyMember::with(['user', 'loyaltyCard'])->findOrFail($id);
        return response()->json($member);
    }

    // Create loyalty members for all users with role "user" (excluding agents)
    public function createMembersForAllUsers()
    {
        try {
            DB::beginTransaction();

            // Get all users with role "user" and explicitly exclude users with role "agent"
            $users = User::where(function($query) {
                // Check if user has role_id pointing to 'user' role
                $query->whereHas('roleModel', function($subQuery) {
                    $subQuery->where('name', 'user');
                })
                // OR check user_details table role
                ->orWhereHas('userDetail', function($subQuery) {
                    $subQuery->where('role', 'user');
                })
                // OR check direct role string (fallback)
                ->orWhere('role', 'user');
            })
            // Explicitly exclude users with role "agent" (in any of the three places)
            ->where(function($query) {
                // Not in roleModel
                $query->whereDoesntHave('roleModel', function($subQuery) {
                    $subQuery->where('name', 'agent');
                })
                // AND not in user_details
                ->whereDoesntHave('userDetail', function($subQuery) {
                    $subQuery->where('role', 'agent');
                })
                // AND not in direct role
                ->where(function($q) {
                    $q->where('role', '!=', 'agent')
                      ->orWhereNull('role');
                });
            })
            // And not already in loyalty_members
            ->whereNotIn('id', function($query) {
                $query->select('user_id')->from('loyalty_members');
            })
            ->get();

            $createdMembers = [];

            foreach ($users as $user) {
                $member = LoyaltyMember::createForUser($user->id);
                if ($member) {
                    $createdMembers[] = $member;
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Loyalty members created successfully',
                'created_count' => count($createdMembers),
                'members' => $createdMembers
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create loyalty members',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Create loyalty member for a specific user
    public function createMemberForUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        try {
            // Check if user already has loyalty membership
            $existingMember = LoyaltyMember::where('user_id', $request->user_id)->first();
            if ($existingMember) {
                return response()->json([
                    'error' => 'User already has a loyalty membership'
                ], 409);
            }

            // Check if user has role "user" (check multiple sources for compatibility)
            $user = User::with(['roleModel', 'userDetail'])->find($request->user_id);
            $isUserRole = false;
            
            // Check role_id first (new system)
            if ($user->roleModel && $user->roleModel->name === 'user') {
                $isUserRole = true;
            }
            // Check user_details table (existing system)
            elseif ($user->userDetail && $user->userDetail->role === 'user') {
                $isUserRole = true;
            }
            // Check direct role string (fallback)
            elseif ($user->role === 'user') {
                $isUserRole = true;
            }
            
            if (!$isUserRole) {
                return response()->json([
                    'error' => 'Only users with role "user" can have loyalty membership'
                ], 400);
            }

            $member = LoyaltyMember::createForUser($request->user_id);
            
            if (!$member) {
                return response()->json([
                    'error' => 'Failed to create loyalty member'
                ], 500);
            }

            return response()->json([
                'message' => 'Loyalty member created successfully',
                'member' => $member->load(['user', 'loyaltyCard'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create loyalty member',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Refresh loyalty data for all members
    public function refreshAllMembersData()
    {
        try {
            $members = LoyaltyMember::where('is_active', true)->get();
            
            foreach ($members as $member) {
                $member->refreshLoyaltyData();
            }

            return response()->json([
                'message' => 'All loyalty member data refreshed successfully',
                'updated_count' => $members->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to refresh loyalty data',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    // Refresh loyalty data for a specific member
    public function refreshMemberData($id)
    {
        try {
            $member = LoyaltyMember::findOrFail($id);
            $oldPoints = $member->total_points;
            $oldCardType = $member->card_type;
            
            $member->refreshLoyaltyData();

            return response()->json([
                'message' => 'Loyalty member data refreshed successfully',
                'member' => $member->load(['user', 'loyaltyCard']),
                'changes' => [
                    'points' => [
                        'old' => $oldPoints,
                        'new' => $member->total_points
                    ],
                    'card_type' => [
                        'old' => $oldCardType,
                        'new' => $member->card_type
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to refresh member data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Update member status (activate/deactivate)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'is_active' => 'required|boolean'
        ]);

        try {
            $member = LoyaltyMember::findOrFail($id);
            $member->is_active = $request->is_active;
            $member->save();

            return response()->json([
                'message' => 'Member status updated successfully',
                'member' => $member->load(['user', 'loyaltyCard'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update member status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Get loyalty statistics
    public function getStatistics()
    {
        try {
            $totalMembers = LoyaltyMember::count();
            $activeMembers = LoyaltyMember::where('is_active', true)->count();
            
            $membersByTier = LoyaltyMember::select('card_type', DB::raw('count(*) as count'))
                ->groupBy('card_type')
                ->get();

            $totalPoints = LoyaltyMember::sum('total_points');
            $averagePoints = LoyaltyMember::avg('total_points');

            return response()->json([
                'total_members' => $totalMembers,
                'active_members' => $activeMembers,
                'inactive_members' => $totalMembers - $activeMembers,
                'members_by_tier' => $membersByTier,
                'total_points_distributed' => $totalPoints,
                'average_points_per_member' => round($averagePoints, 2)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to get statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Get loyalty report data
    public function getReport()
    {
        try {
            $members = LoyaltyMember::with(['user', 'loyaltyCard'])
                ->where('is_active', true)
                ->get()
                ->map(function ($member) {
                    // Calculate total amount spent (estimated based on bookings)
                    $totalBookings = 0;
                    $totalAmount = 0;
                    
                    if ($member->user) {
                        $bookings = $member->user->bookings()
                            ->where('status', 'confirmed')
                            ->get();
                        
                        $totalBookings = $bookings->count();
                        $totalAmount = $bookings->sum('price');
                    }

                    return [
                        'customer_id' => $member->card_number,
                        'customer_name' => $member->member_name,
                        'total_bookings' => $totalBookings,
                        'total_amount' => $totalAmount,
                        'points_earned' => $member->total_points,
                        'tier' => $member->card_type,
                        'member_since' => $member->member_since,
                        'is_active' => $member->is_active,
                        'last_updated' => $member->last_updated,
                    ];
                });

            return response()->json($members);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to get loyalty report',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Delete a loyalty member
    public function destroy($id)
    {
        try {
            $member = LoyaltyMember::findOrFail($id);
            $member->delete();

            return response()->json([
                'message' => 'Loyalty member deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete loyalty member',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Remove any existing agents from loyalty members table
    public function removeAgentMembers()
    {
        try {
            // Find all loyalty members that belong to users with role 'agent'
            $agentMembers = LoyaltyMember::whereHas('user', function($query) {
                $query->where(function($q) {
                    // Check all three possible places where role can be stored
                    $q->whereHas('roleModel', function($subQuery) {
                        $subQuery->where('name', 'agent');
                    })
                    ->orWhereHas('userDetail', function($subQuery) {
                        $subQuery->where('role', 'agent');
                    })
                    ->orWhere('role', 'agent');
                });
            })->get();
            
            $count = $agentMembers->count();
            
            // Delete all agent members
            foreach ($agentMembers as $member) {
                $member->delete();
            }
            
            return response()->json([
                'message' => 'Successfully removed agents from loyalty program',
                'removed_count' => $count
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to remove agent members',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
