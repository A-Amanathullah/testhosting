<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $table = 'bookings';

    protected $fillable = [
        'user_id',
        'bus_id',
        'bus_no',
        'serial_no',
        'name',
        'reserved_tickets',
        'seat_no',
        'pickup',
        'drop',
        'role',
        'payment_status',
        'status',
        'departure_date',
        'booked_date',
        'reason',
        'price',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bus()
    {
        return $this->belongsTo(BusRegister::class, 'bus_id');
    }
}
