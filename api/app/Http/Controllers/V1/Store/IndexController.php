<?php

namespace App\Http\Controllers\V1\Store;

use App\Http\Resources\StoreResource;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class IndexController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $query = Store::query();
        if (!$request->user()->role?->isAdmin()) {
            if ($request->get('all'))
                $query->whereIn('company_id', $request->user()->stores->pluck('company_id')->unique());
            else
                $query->whereIn('id', $request->user()->stores->pluck('id'));
        }

        return new JsonResponse(StoreResource::collection($query->orderBy('sort')->get()));
    }
}
