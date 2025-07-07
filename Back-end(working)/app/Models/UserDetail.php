<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    use HasFactory;

    protected $table = 'user_details';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone_no',
        'gender',
        'email',
        'role',
        'nic_no',
        'address',
        'profile_image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}