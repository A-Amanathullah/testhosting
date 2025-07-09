<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionsSeeder extends Seeder
{
    public function run()
    {
        $modules = [
            ['name' => 'Dashboard', 'actions' => ['view', 'edit']],
            ['name' => 'Bus Schedule', 'actions' => ['view', 'add', 'edit', 'delete']],
            ['name' => 'Bus Routes', 'actions' => ['view', 'add', 'edit', 'delete']],
            ['name' => 'Bus Register', 'actions' => ['view', 'add', 'edit', 'delete']],
            ['name' => 'Booking Management', 'submodules' => [
                ['name' => 'Bus Booking', 'actions' => ['view', 'print', 'cancel']],
                ['name' => 'Freezing Seat', 'actions' => ['view', 'print']],
            ]],
            ['name' => 'Staff Management', 'submodules' => [
                ['name' => 'Staff List', 'actions' => ['view', 'add', 'edit', 'delete', 'print']],
                ['name' => 'Role Access Management', 'actions' => ['view', 'add', 'edit']],
            ]],
            ['name' => 'Report', 'submodules' => [
                ['name' => 'Bus Booking Report', 'actions' => ['view', 'print']],
                ['name' => 'Cancellation Report', 'actions' => ['view', 'print']],
                ['name' => 'Agentwise Report', 'actions' => ['view', 'print']],
                ['name' => 'Revenue Report', 'actions' => ['view', 'print']],
                ['name' => 'Loyalty Report', 'actions' => ['view', 'print']],
            ]],
            ['name' => 'Bus Tracking', 'actions' => ['view']],
            ['name' => 'Loyalty Management', 'submodules' => [
                ['name' => 'Loyalty Card', 'actions' => ['view', 'add', 'edit', 'delete']],
                ['name' => 'Loyalty Report', 'actions' => ['view', 'print']],
            ]],
            ['name' => 'User Management', 'actions' => ['view', 'add', 'edit', 'delete']],
            ['name' => 'SMS Template', 'actions' => ['view', 'add', 'edit', 'delete']],
            ['name' => 'Profile', 'actions' => ['view', 'edit']],
        ];

        $roles = ['Superadmin', 'Admin', 'Manager', 'Storekeeper', 'Data Entry Operator'];
        $permissions = [];

        foreach ($roles as $role) {
            $permissions[$role] = [];
            foreach ($modules as $mod) {
                if (isset($mod['submodules'])) {
                    foreach ($mod['submodules'] as $sub) {
                        $permissions[$role][$sub['name']] = self::getPermissionsForRole($role, $sub['actions'], $sub['name']);
                    }
                } else {
                    $permissions[$role][$mod['name']] = self::getPermissionsForRole($role, $mod['actions'], $mod['name']);
                }
            }
        }

        // Save to DB (adjust table/model as needed)
        foreach ($permissions as $role => $perms) {
            DB::table('role_permissions')->updateOrInsert(
                ['role' => $role],
                ['permissions' => json_encode($perms)]
            );
        }
    }

    private static function getPermissionsForRole($role, $actions, $moduleName)
    {
        $perm = ['module' => true];
        switch ($role) {
            case 'Superadmin':
            case 'Admin':
                foreach ($actions as $action) {
                    $perm[$action] = true;
                }
                break;
            case 'Manager':
                foreach ($actions as $action) {
                    $perm[$action] = $action === 'view';
                }
                break;
            case 'Storekeeper':
                if ($moduleName === 'Profile' || str_contains(strtolower($moduleName), 'report')) {
                    foreach ($actions as $action) {
                        $perm[$action] = true;
                    }
                } else {
                    foreach ($actions as $action) {
                        $perm[$action] = false;
                    }
                }
                break;
            case 'Data Entry Operator':
                foreach ($actions as $action) {
                    $perm[$action] = in_array($action, ['view', 'add']);
                }
                break;
        }
        return $perm;
    }
}