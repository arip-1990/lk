<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $title
 * @property string|null $link
 * @property string $type
 * @property integer $sort
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Category $category
 * @property User $user
 */
class Training extends Model
{
    use HasFactory;

    const TYPE_VIDEO = 'video';
    const TYPE_DOCUMENT = 'document';

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id', 'title', 'link', 'type', 'sort', 'user_id', 'category_id'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
