<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property integer $id
 * @property string $user
 * @property string $post
 * @property string $time_card_number
 * @property Collection $attendance
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Normative $normative
 * @property Store $store
 */
class TimeCard extends Model
{
    use HasFactory;

    protected $casts = [
        'attendance' => AsCollection::class,
    ];
    protected $fillable = ['user', 'post', 'time_card_number', 'attendance', 'normative_id', 'store_id'];

    public function normative(): BelongsTo
    {
        return $this->belongsTo(Normative::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
