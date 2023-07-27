<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @property string $id
 * @property string $must
 * @property ?string $comment
 * @property boolean $status
 * @property ?Carbon $done_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 *
 * @property Category $category
 * @property User $applicant
 * @property ?User $performer
 * @property ?Store $store
 */
class Statement extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'done_at' => 'datetime',
    ];
    protected $fillable = ['id', 'must', 'comment', 'status', 'done_at', 'category_id', 'applicant_id', 'performer_id', 'store_id'];

    public function getMediaPath(): string
    {
        return 'statements/' . ($this->store_id ?? 'office');
    }

    public function hasMedia(bool $answer = false): bool
    {
        $hasFile = false;
        foreach (Storage::files($this->getMediaPath()) as $file) {
            $file = explode('/', $file);
            $file = array_pop($file);

            if (str_starts_with($file, $answer ? "answer_{$this->id}" : $this->id)) {
                $hasFile = true;
                break;
            }
        }

        return $hasFile;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applicant_id');
    }

    public function performer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performer_id');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
