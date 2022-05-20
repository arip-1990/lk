<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $name
 * @property Collection<string> $phones
 * @property boolean $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property Collection<Claim> $claims
 */
class Provider extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'phones' => AsCollection::class,
    ];
    protected $fillable = ['id', 'name', 'phones', 'status'];

    public function claims(): HasMany
    {
        return $this->hasMany(Claim::class);
    }
}
