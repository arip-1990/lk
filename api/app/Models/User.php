<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property string $id
 * @property ?string $email
 * @property ?string $mobile_phone
 * @property Collection<string> $internal_phones
 * @property string $barcode
 * @property ?string $inn
 * @property string $first_name
 * @property string $last_name
 * @property ?string $middle_name
 * @property ?string $position
 * @property boolean $status
 * @property ?string $remember_token
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property ?Carbon $deleted_at
 *
 * @property ?Role $role
 * @property Collection<Grant> $grants
 * @property Collection<Store> $stores
 * @property Collection<Test> $tests
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'internal_phones' => AsCollection::class,
    ];
    protected $fillable = ['id', 'email', 'mobile_phone', 'internal_phones', 'barcode', 'inn', 'first_name', 'last_name', 'middle_name', 'position', 'status'];

//    public function receivesBroadcastNotificationsOn(): string
//    {
//        return "users.{$this->id}";
//    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', true);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function stores(): BelongsToMany
    {
        return $this->belongsToMany(Store::class);
    }

    public function tests(): HasMany
    {
        return $this->hasMany(Test::class);
    }
}
