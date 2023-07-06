<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property string $name
 * @property ?string $description
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
class Role extends Model
{
    use HasFactory;

    const ADMIN = 'admin';
    const MANAGER = 'manager';
    const WORKER = 'worker';

    protected $fillable = ['name', 'description'];

    public function isAdmin(): bool
    {
        return $this->name === self::ADMIN;
    }
}
