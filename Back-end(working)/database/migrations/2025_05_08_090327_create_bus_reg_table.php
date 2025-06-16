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
        Schema::create('bus_reg', function (Blueprint $table) {
            $table->id();
            $table->string('bus_no')->unique();
            $table->string('start_point');
            $table->string('end_point');
            $table->integer('total_seats');
            $table->string('image')->nullable(); // stores path like 'bus-images/abc.jpg'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bus_reg');
    }
};
