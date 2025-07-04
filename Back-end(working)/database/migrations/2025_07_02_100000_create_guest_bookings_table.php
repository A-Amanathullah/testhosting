<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guest_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->foreignId('bus_id')->constrained('bus_reg');
            $table->string('bus_no');
            $table->string('serial_no');
            $table->integer('reserved_tickets');
            $table->string('seat_no');
            $table->string('pickup');
            $table->string('drop');
            $table->date('departure_date');
            $table->string('reason')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('status')->default('confirmed');
            $table->string('payment_status')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guest_bookings');
    }
};
