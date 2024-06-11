<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'inventory_number',
        'line1',
        'line2',
        'barcode',
        'sheet',
        'category_id',
        'store_id'
    ];

    public function category():BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function store():BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

}
