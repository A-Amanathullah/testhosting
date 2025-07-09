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
        Schema::create('route_stops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bus_route_id')->constrained()->onDelete('cascade');
            $table->string('stop_name'); // Village/City name
            $table->integer('stop_order'); // Order of stop in route (1, 2, 3...)
            $table->integer('distance_from_start')->nullable(); // Distance in KM
            $table->integer('duration_from_start')->nullable(); // Duration in minutes
            $table->decimal('fare_from_start', 8, 2)->nullable(); // Fare from route start
            $table->timestamps();
            
            $table->index(['bus_route_id', 'stop_order']);
            $table->unique(['bus_route_id', 'stop_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('route_stops');
    }
};
