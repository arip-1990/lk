<?php

namespace App\Http\Controllers\V1\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Inventory;


class DeleteInventory extends Controller
{
    public function delete(string $id):void
    {
        $invent = Inventory::query()->where('id', $id);
        $invent->delete();
    }
}


