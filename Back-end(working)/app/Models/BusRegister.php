<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BusRegister extends Model
{

    protected $table = 'bus_reg';
    
    use HasFactory;

    protected $fillable = [
        'bus_no',
        'start_point',
        'end_point',
        'total_seats',
        'image',
    ];
}
