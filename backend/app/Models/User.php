<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone_number',
        'role',
        'mofa_id',
        'district',
        'is_verified',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
    ];

    public function harvestLogs(): HasMany
    {
        return $this->hasMany(HarvestLog::class);
    }

    public function equipmentListings(): HasMany
    {
        return $this->hasMany(EquipmentListing::class);
    }

    public function buyerOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'buyer_id');
    }
}

