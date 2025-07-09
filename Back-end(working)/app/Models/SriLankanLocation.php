<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SriLankanLocation extends Model
{
    protected $fillable = [
        'name',
        'name_si',
        'name_ta',
        'district',
        'province',
        'type',
        'latitude',
        'longitude',
        'is_major_stop',
        'data_source',
        'verified',
        'last_verified_at'
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_major_stop' => 'boolean',
        'verified' => 'boolean',
        'last_verified_at' => 'datetime',
    ];

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_si', 'LIKE', "%{$search}%")
                    ->orWhere('name_ta', 'LIKE', "%{$search}%");
    }

    public function scopeMajorStops($query)
    {
        return $query->where('is_major_stop', true);
    }

    // Scope for verified locations only
    public function scopeVerified($query)
    {
        return $query->where('verified', true);
    }
}
