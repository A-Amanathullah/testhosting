<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusTrip extends Model
{
    protected $fillable = [
        'bus_id',
        'bus_no',
        'driver_name',
        'driver_contact',
        'conductor_name',
        'conductor_contact',
        'departure_date',
        'departure_time',
        'start_point',
        'end_point',
        'available_seats',
        'price',
        'duration',
        'arrival_date',     // new
        'arrival_time',     // new
    ];

}
