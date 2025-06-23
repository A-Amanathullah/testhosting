<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RolePermission;

class RolePermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Return all permissions for all roles
        return response()->json([
            'status' => 'success',
            'data' => RolePermission::all()->pluck('permissions', 'role')
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($role)
    {
        // Return permissions for a specific role
        $perm = RolePermission::where('role', $role)->first();
        if (!$perm) {
            return response()->json(['status' => 'error', 'message' => 'Role not found'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $perm->permissions]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        foreach ($request->all() as $role => $permissions) {
            RolePermission::updateOrCreate(
                ['role' => $role],
                ['permissions' => $permissions]
            );
        }
        return response()->json(['status' => 'success']);
    }
}
