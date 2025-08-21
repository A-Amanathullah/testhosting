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
            // Change contact fields from integer to string to support phone numbers with + and longer digits
            $table->string('driver_contact')->change();
            $table->string('conductor_contact')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bus_trips', function (Blueprint $table) {
            // Revert back to integer (be careful about data loss)
            $table->integer('driver_contact')->change();
            $table->integer('conductor_contact')->change();
        });
    }
};
