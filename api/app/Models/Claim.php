<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $invoice
 * @property integer|null $not_delivery
 * @property string|null $not_attachment
 * @property string|null $regrading
 * @property Carbon|null $short_shelf_life
 * @property Carbon|null $delivery_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property User $user
 * @property Store $store
 * @property Provider $provider
 */
class Claim extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'short_shelf_life' => 'datetime',
        'delivery_at' => 'datetime',
    ];
    protected $fillable = ['id', 'invoice', 'not_delivery', 'not_attachment', 'regrading', 'short_shelf_life', 'delivery_at', 'provider_id', 'store_id', 'user_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }
}
