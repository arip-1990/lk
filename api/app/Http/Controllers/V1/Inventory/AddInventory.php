<?php

namespace App\Http\Controllers\V1\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Inventory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddInventory extends Controller
{
    public function store(Request $request):JsonResponse
    {
        $validatedData = $request->validate([
            'description' => 'required|string',
            'inventory_number' => 'required|string|max:255',
            'line1' => 'required|string|max:255',
            'line2' => 'required|string|max:255',
            'barcode' => 'required|string|max:255',
            'sheet' => 'required|string|max:255',
            'category_id' => 'required|integer',
            'store_id' => 'nullable|string|max:255',
        ]);

        $inventory = Inventory::create($validatedData);
        return new JsonResponse($inventory);
    }
}

