<?php
namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => Role::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'label' => 'nullable|string',
        ]);
        $role = Role::create($request->only(['name', 'label']));
        return response()->json(['status' => 'success', 'data' => $role]);
    }
}
