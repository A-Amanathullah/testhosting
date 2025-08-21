<?php

namespace App\Http\Controllers;

use App\Models\AgentCommission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AgentCommissionController extends Controller
{
    /**
     * Display a listing of all agent commissions.
     */
    public function index(): JsonResponse
    {
        try {
            $commissions = AgentCommission::with('user:id,name,email')
                ->orderBy('user_name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $commissions,
                'message' => 'Agent commissions retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving agent commissions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created commission in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'commission_type' => 'required|in:percentage,fixed',
            'commission_value' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get user details
            $user = User::findOrFail($request->user_id);

            // Check if commission already exists for this user
            $existingCommission = AgentCommission::where('user_id', $request->user_id)->first();
            if ($existingCommission) {
                return response()->json([
                    'success' => false,
                    'message' => 'Commission already exists for this user. Use update instead.'
                ], 409);
            }

            $commission = AgentCommission::create([
                'user_id' => $request->user_id,
                'user_name' => $user->name,
                'user_role' => $user->role,
                'commission_type' => $request->commission_type,
                'commission_value' => $request->commission_value,
                'is_active' => $request->get('is_active', true),
                'notes' => $request->notes,
            ]);

            return response()->json([
                'success' => true,
                'data' => $commission,
                'message' => 'Agent commission created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating commission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified commission.
     */
    public function show(AgentCommission $agentCommission): JsonResponse
    {
        try {
            $agentCommission->load('user:id,name,email');
            
            return response()->json([
                'success' => true,
                'data' => $agentCommission,
                'message' => 'Agent commission retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving commission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified commission in storage.
     */
    public function update(Request $request, AgentCommission $agentCommission): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'commission_type' => 'sometimes|required|in:percentage,fixed',
            'commission_value' => 'sometimes|required|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $agentCommission->update($request->only([
                'commission_type',
                'commission_value',
                'is_active',
                'notes'
            ]));

            return response()->json([
                'success' => true,
                'data' => $agentCommission,
                'message' => 'Agent commission updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating commission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified commission from storage.
     */
    public function destroy(AgentCommission $agentCommission): JsonResponse
    {
        try {
            $agentCommission->delete();

            return response()->json([
                'success' => true,
                'message' => 'Agent commission deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting commission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Initialize commissions for all agents with default 10%
     */
    public function initializeAgentCommissions(): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Get all agents who don't have commissions yet
            $agents = User::where('role', 'agent')
                ->whereNotExists(function ($query) {
                    $query->select(DB::raw(1))
                        ->from('agent_commissions')
                        ->whereColumn('agent_commissions.user_id', 'users.id');
                })
                ->get();

            $createdCount = 0;
            foreach ($agents as $agent) {
                AgentCommission::create([
                    'user_id' => $agent->id,
                    'user_name' => $agent->name,
                    'user_role' => $agent->role,
                    'commission_type' => 'percentage',
                    'commission_value' => 10.00,
                    'is_active' => true,
                    'notes' => 'Default commission initialized automatically'
                ]);
                $createdCount++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Initialized commissions for {$createdCount} agents",
                'data' => ['created_count' => $createdCount]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error initializing commissions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get commission for a specific agent (for calculation purposes)
     */
    public function getAgentCommission(int $userId): JsonResponse
    {
        try {
            $commission = AgentCommission::where('user_id', $userId)
                ->where('is_active', true)
                ->first();

            if (!$commission) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active commission found for this agent'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $commission,
                'message' => 'Agent commission retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving agent commission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate commission for a booking
     */
    public function calculateCommission(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'booking_price' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $commission = AgentCommission::where('user_id', $request->user_id)
                ->where('is_active', true)
                ->first();

            if (!$commission) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active commission found for this agent',
                    'commission_amount' => 0
                ], 404);
            }

            $commissionAmount = $commission->calculateCommission((float) $request->booking_price);

            return response()->json([
                'success' => true,
                'data' => [
                    'commission_amount' => $commissionAmount,
                    'commission_type' => $commission->commission_type,
                    'commission_value' => $commission->commission_value,
                    'formatted_commission' => $commission->formatted_commission
                ],
                'message' => 'Commission calculated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error calculating commission: ' . $e->getMessage()
            ], 500);
        }
    }
}
