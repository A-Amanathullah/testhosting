<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestBooking extends Model
{
    use HasFactory;

    protected $table = 'guest_bookings';

    protected $fillable = [
        'name', 'phone', 'email', 'bus_id', 'bus_no', 'serial_no', 'reserved_tickets', 'seat_no', 'pickup', 'drop', 'departure_date', 'reason', 'price', 'status', 'payment_status', 'agent_id'
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'departure_date' => 'date:Y-m-d',
    ];

    /**
     * Get the agent that created this booking
     */
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}
