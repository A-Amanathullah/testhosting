<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusRoute extends Model
{
    protected $fillable = ['from', 'to', 'stops'];

    protected $casts = [
        'stops' => 'array',
    ];
}
