<?php

namespace App\Http\Controllers\V1\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function handle(string $id, Request $request):JsonResponse
    {
        if ($request->get('store_id')) {
            return new JsonResponse(Inventory::query()
                ->where('category_id', $id)
                ->where('store_id', $request->get('store_id'))
                ->with('store')
                ->get());
        }

        return new JsonResponse(Inventory::query()->where('category_id', $id)->with('store')->get());
    }
}

