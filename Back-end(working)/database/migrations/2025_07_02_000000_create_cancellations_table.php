<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cancellations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('bus_id')->constrained('bus_reg');
            $table->string('bus_no');
            $table->foreign('bus_no')->references('bus_no')->on('bus_reg');
            $table->string('serial_no');
            $table->string('name');
            $table->integer('reserved_tickets');
            $table->string('seat_no');
            $table->string('pickup');
            $table->string('drop');
            $table->string('role');
            $table->string('payment_status');
            $table->string('status');
            $table->date('departure_date');
            $table->date('booked_date');
            $table->string('reason')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cancellations');
    }
};
