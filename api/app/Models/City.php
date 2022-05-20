<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $name
 * @property string $type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class City extends Model
{
    use HasFactory;

    const TYPE_CITY = 'city';
    const TYPE_TOWNSHIP = 'township';
    const TYPE_VILLAGE = 'village';
    const TYPE_MICRO_DISTRICT = 'micro-district';

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id', 'name', 'type'];
}
