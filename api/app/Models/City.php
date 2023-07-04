<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $name
 * @property string $prefix
 * @property string $type
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 *
 * @property ?City $parent
 * @property Collection<City> $children
 * @property Collection<Location> $locations
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
    protected $fillable = ['id', 'name', 'prefix', 'type'];

    public function getName(): string
    {
        return $this->parent ? $this->parent->name : $this->name;
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }
}
