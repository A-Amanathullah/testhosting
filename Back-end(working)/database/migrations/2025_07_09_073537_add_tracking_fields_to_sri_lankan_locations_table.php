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
        Schema::table('sri_lankan_locations', function (Blueprint $table) {
            $table->string('data_source')->nullable()->after('is_major_stop');
            $table->boolean('verified')->default(false)->after('data_source');
            $table->timestamp('last_verified_at')->nullable()->after('verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sri_lankan_locations', function (Blueprint $table) {
            $table->dropColumn(['data_source', 'verified', 'last_verified_at']);
        });
    }
};
