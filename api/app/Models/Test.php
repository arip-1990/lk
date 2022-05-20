<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property float $score
 * @property Carbon|null $finished_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Collection<Result> $results
 * @property Category $category
 * @property User $user
 */
class Test extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'finished_at' => 'datetime',
    ];
    protected $fillable = ['id', 'score', 'finished_at', 'category_id', 'user_id'];

    public function finish(float $score): void
    {
        $this->score = $score;
        $this->finished_at = Carbon::now();
    }

    public function results(): HasMany
    {
        return $this->hasMany(Result::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
