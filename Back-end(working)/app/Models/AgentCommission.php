<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgentCommission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_name',
        'user_role',
        'commission_type',
        'commission_value',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'commission_value' => 'decimal:2',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the commission.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calculate commission amount based on booking price
     */
    public function calculateCommission(float $bookingPrice): float
    {
        if (!$this->is_active) {
            return 0.0;
        }

        $commissionValue = (float) $this->commission_value;

        if ($this->commission_type === 'percentage') {
            return ($bookingPrice * $commissionValue) / 100;
        } else {
            // Fixed amount
            return $commissionValue;
        }
    }

    /**
     * Scope to get only active commissions
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get commissions by role
     */
    public function scopeByRole($query, string $role)
    {
        return $query->where('user_role', $role);
    }

    /**
     * Get formatted commission display
     */
    public function getFormattedCommissionAttribute(): string
    {
        $commissionValue = (float) $this->commission_value;
        
        if ($this->commission_type === 'percentage') {
            return $commissionValue . '%';
        } else {
            return 'Rs. ' . number_format($commissionValue, 2);
        }
    }
}
