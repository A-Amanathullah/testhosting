<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\RolePermission;

// Create default permissions for User role
RolePermission::updateOrCreate(
    ['role' => 'User'],
    ['permissions' => []]
);

echo "Default permissions created for User role\n";
