<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'role_id',
        'current_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'current_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userDetail()
    {
        return $this->hasOne(UserDetail::class, 'user_id');
    }

    public function roleModel()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function loyaltyMember()
    {
        return $this->hasOne(LoyaltyMember::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // Helper method to get role name (uses role_id if available, falls back to role string)
    public function getRoleName()
    {
        if ($this->roleModel) {
            return $this->roleModel->name;
        }
        return $this->role;
    }

    // Helper method to check if user has a specific role (supports multiple role names)
    public function hasRole($roleName)
    {
        $roleNames = is_array($roleName) ? $roleName : [$roleName];
        $userRole = $this->getRoleName();
        
        // Case-insensitive comparison
        foreach ($roleNames as $role) {
            if (strtolower($userRole) === strtolower($role)) {
                return true;
            }
        }
        
        return false;
    }

    // Helper method to check if user has any admin-like role
    public function hasAnyAdminRole()
    {
        return $this->hasRole(['Superadmin', 'Admin', 'Manager', 'admin', 'superadmin', 'manager']);
    }
}
