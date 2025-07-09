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
        Schema::create('sri_lankan_locations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Location name
            $table->string('name_si')->nullable(); // Sinhala name
            $table->string('name_ta')->nullable(); // Tamil name
            $table->string('district');
            $table->string('province');
            $table->string('type')->default('village'); // village, city, town
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_major_stop')->default(false);
            $table->string('data_source')->nullable(); // osm, government, user
            $table->boolean('verified')->default(false);
            $table->timestamp('last_verified_at')->nullable();
            $table->timestamps();
            
            $table->index('name');
            $table->index('district');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sri_lankan_locations');
    }
};
