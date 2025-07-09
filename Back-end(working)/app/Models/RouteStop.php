<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RouteStop extends Model
{
    protected $fillable = [
        'bus_route_id',
        'stop_name',
        'stop_order',
        'distance_from_start',
        'duration_from_start',
        'fare_from_start',
    ];

    protected $casts = [
        'fare_from_start' => 'decimal:2',
    ];

    public function busRoute(): BelongsTo
    {
        return $this->belongsTo(BusRoute::class);
    }
}
