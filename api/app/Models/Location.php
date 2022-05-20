<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property Collection $coordinate
 * @property string $street
 * @property string|null $house
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Location extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'coordinate' => AsCollection::class,
    ];
    protected $fillable = ['id', 'coordinate', 'street', 'house'];
}
