<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('loyalty_card_id')->constrained('loyalty_cards')->onDelete('cascade');
            $table->string('member_name');
            $table->string('card_number')->unique();
            $table->integer('total_points')->default(0);
            $table->string('card_type'); // Silver, Gold, Platinum, etc.
            $table->date('member_since');
            $table->timestamp('last_updated')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Add indexes for better performance
            $table->index(['user_id']);
            $table->index(['card_type']);
            $table->index(['total_points']);
            $table->index(['is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_members');
    }
};
