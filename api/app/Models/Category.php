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
 * @property integer $id
 * @property string $name
 * @property string $type
 * @property string|null $description
 * @property integer $sort
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Category $parent
 * @property Collection<Category> $children
 */
class Category extends Model
{
    use HasFactory;

    const TYPE_CATEGORY = 'category';
    const TYPE_DOCUMENT = 'document';
    const TYPE_TEST = 'test';
    const TYPE_CLAIM = 'claim';
    const TYPE_TRAINING = 'training';

    protected $fillable = ['name', 'type', 'description', 'sort', 'parent_id'];

    public function scopeWithRoot(Builder $query): Builder
    {
        return $query->where('parent_id', null);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }
}
