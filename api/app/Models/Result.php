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
 * @property Collection<string> $answers
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Test $test
 * @property Question $question
 */
class Result extends Model
{
    use HasFactory;

    protected $casts = [
        'answers' => AsCollection::class,
    ];
    protected $fillable = ['answers', 'test_id', 'question_id'];

    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
