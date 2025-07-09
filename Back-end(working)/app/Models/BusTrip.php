<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'arrival_date',
        'arrival_time',
        'bus_route_id',
    ];

    protected $casts = [
        'departure_date' => 'date',
        'arrival_date' => 'date',
        'departure_time' => 'datetime:H:i',
        'arrival_time' => 'datetime:H:i',
    ];

    public function busRoute(): BelongsTo
    {
        return $this->belongsTo(BusRoute::class);
    }

    public function scopeForRoute($query, $fromLocation, $toLocation, $date)
    {
        return $query->whereHas('busRoute', function ($routeQuery) use ($fromLocation, $toLocation) {
            $routeQuery->whereHas('routeStops', function ($fromStopQuery) use ($fromLocation) {
                $fromStopQuery->where('stop_name', $fromLocation);
            })->whereHas('routeStops', function ($toStopQuery) use ($toLocation) {
                $toStopQuery->where('stop_name', $toLocation);
            });
        })->where('departure_date', $date)
          ->where('available_seats', '>', 0);
    }
}
