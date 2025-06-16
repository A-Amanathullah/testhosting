<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Staff extends Model
{
    use HasFactory;

    protected $table = 'staffs';

    protected $fillable = [
        'user_id',
        'name',
        'contact_number',
        'nic_no',
        'address',
        'email',
        'role',
        'profile_image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
