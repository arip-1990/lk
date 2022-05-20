<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $days
 * @property integer $hours
 * @property Collection $schedule
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Normative extends Model
{
    use HasFactory;

    protected $casts = [
        'schedule' => AsCollection::class,
    ];
    protected $fillable = ['days', 'hours', 'schedule'];
}
