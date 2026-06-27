<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tool_name',
        'daily_rate_cedis',
        'is_available',
    ];

    protected $casts = [
        'daily_rate_cedis' => 'decimal:2',
        'is_available' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

