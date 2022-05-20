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
 */
class Document extends Model
{
    use HasFactory;

    const TYPE_PDF = 'pdf';

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id', 'title', 'type', 'sort', 'category_id'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
