<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cancellation extends Model
{
    use HasFactory;

    protected $table = 'cancellations';

    protected $fillable = [
        'user_id', 'bus_id', 'bus_no', 'serial_no', 'name', 'phone', 'email', 'agent_id', 'reserved_tickets', 'seat_no', 'pickup', 'drop', 'role', 'payment_status', 'status', 'booking_type', 'departure_date', 'booked_date', 'reason', 'price'
    ];
}
