<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bus_trips', function (Blueprint $table) {
            // Only add bus_route_id if it doesn't exist
            if (!Schema::hasColumn('bus_trips', 'bus_route_id')) {
                $table->foreignId('bus_route_id')->nullable()->constrained('bus_routes')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bus_trips', function (Blueprint $table) {
            if (Schema::hasColumn('bus_trips', 'bus_route_id')) {
                $table->dropForeign(['bus_route_id']);
                $table->dropColumn('bus_route_id');
            }
        });
    }
};
