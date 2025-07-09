<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusRoute extends Model
{
    protected $fillable = [
        'route_code',
        'route_name',
        'start_location',
        'end_location',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function routeStops(): HasMany
    {
        return $this->hasMany(RouteStop::class)->orderBy('stop_order');
    }

    public function busTrips(): HasMany
    {
        return $this->hasMany(BusTrip::class);
    }

    public function getStopNames(): array
    {
        return $this->routeStops->pluck('stop_name')->toArray();
    }

    public function hasStop(string $stopName): bool
    {
        return $this->routeStops()->where('stop_name', $stopName)->exists();
    }

    public function getStopOrder(string $stopName): ?int
    {
        $stop = $this->routeStops()->where('stop_name', $stopName)->first();
        return $stop ? $stop->stop_order : null;
    }
}
