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
            $table->foreignId('bus_id')->nullable()->after('id')->constrained('bus_reg');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bus_trips', function (Blueprint $table) {
            $table->dropForeign(['bus_id']);
            $table->dropColumn('bus_id');
        });
    }
};
