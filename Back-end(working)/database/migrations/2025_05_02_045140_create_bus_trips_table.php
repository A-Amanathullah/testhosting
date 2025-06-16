<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('bus_trips', function (Blueprint $table) {
        $table->id();
        $table->string('bus_no');
        $table->string('driver_name');
        $table->integer('driver_contact');
        $table->string('conductor_name');
        $table->integer('conductor_contact');
        $table->date('departure_date');
        $table->time('departure_time');
        $table->string('start_point');
        $table->string('end_point');
        $table->integer('available_seats');
        $table->integer('price');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bus_trips');
    }
};
