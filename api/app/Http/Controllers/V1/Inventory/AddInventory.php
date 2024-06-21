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
            'description' => 'nullable|string',
            'inventory_number' => 'nullable|string|max:255',
            'line1' => 'nullable|string|max:255',
            'line2' => 'nullable|string|max:255',
            'barcode' => 'nullable|string|max:255',
            'sheet' => 'nullable|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
            'store_id' => 'nullable|string|max:255|exists:stores,id',
        ]);

        $inventory = Inventory::create($validatedData);
        return new JsonResponse($inventory);
    }
}

