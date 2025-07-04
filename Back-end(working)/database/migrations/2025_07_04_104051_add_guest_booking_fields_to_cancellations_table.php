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
        Schema::table('cancellations', function (Blueprint $table) {
            // Make user_id nullable to support guest bookings
            $table->foreignId('user_id')->nullable()->change();
            
            // Add guest booking specific fields
            $table->string('phone')->nullable()->after('name');
            $table->string('email')->nullable()->after('phone');
            $table->foreignId('agent_id')->nullable()->after('email')->constrained('users');
            
            // Add booking type to distinguish between regular and guest bookings
            $table->enum('booking_type', ['regular', 'guest'])->default('regular')->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cancellations', function (Blueprint $table) {
            $table->dropColumn(['phone', 'email', 'agent_id', 'booking_type']);
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }
};
