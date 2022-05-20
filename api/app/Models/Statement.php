<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @property string $id
 * @property string $must
 * @property string|null $comment
 * @property boolean $status
 * @property Carbon|null $done_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Category $category
 * @property User $user
 * @property ?Store $store
 */
class Statement extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'done_at' => 'datetime',
    ];
    protected $fillable = ['id', 'must', 'comment', 'status', 'done_at', 'category_id', 'user_id', 'store_id'];

    public function getMediaPath(): string
    {
        return 'statements/' . ($this->store_id ?? 'office');
    }

    public function hasMedia(): bool
    {
        return !!glob(Storage::path('statements/' . $this->store_id ?? 'office') . '/' . $this->id . '_*');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
