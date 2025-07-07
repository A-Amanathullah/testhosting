<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\LoyaltyService;

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

    // Automatically update loyalty points when booking status changes
    // Temporarily disabled to debug issues
    /*
    protected static function booted()
    {
        static::saved(function ($booking) {
            try {
                // Update loyalty points when booking is confirmed
                if ($booking->isDirty('status') && $booking->status === 'confirmed') {
                    LoyaltyService::updatePointsForBooking($booking);
                }
            } catch (\Exception $e) {
                \Log::error('Error in Booking saved event: ' . $e->getMessage());
            }
        });

        static::created(function ($booking) {
            try {
                // Update loyalty points when new booking is created and confirmed
                if ($booking->status === 'confirmed') {
                    LoyaltyService::updatePointsForBooking($booking);
                }
            } catch (\Exception $e) {
                \Log::error('Error in Booking created event: ' . $e->getMessage());
            }
        });
    }
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bus()
    {
        return $this->belongsTo(BusRegister::class, 'bus_id');
    }
}
