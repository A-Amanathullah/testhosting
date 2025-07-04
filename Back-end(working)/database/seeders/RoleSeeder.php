<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        DB::table('roles')->insertOrIgnore([
            ['name' => 'Superadmin', 'label' => 'Super Administrator', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Admin', 'label' => 'Administrator', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Manager', 'label' => 'Manager', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Storekeeper', 'label' => 'Storekeeper', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Agent', 'label' => 'Agent', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Data Entry Operator', 'label' => 'Data Entry Operator', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'User', 'label' => 'User', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }
}
