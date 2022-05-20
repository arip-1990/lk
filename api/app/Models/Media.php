<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $title
 * @property string $type
 * @property integer $sort
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Category $category
 * @property ?Store $store
 * @property ?User $user
 */
class Media extends Model
{
    use HasFactory;

    const TYPE_DOCUMENT = 'document';
    const TYPE_IMAGE = 'image';

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'medias';
    protected $fillable = ['id', 'title', 'type', 'sort', 'category_id', 'user_id', 'store_id'];

    public function getMediaPath(): string
    {
        return 'medias/' . ($this->store_id ?? 'all');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
