<?php

namespace App\Http\Controllers\V1\Store;

use App\Http\Resources\StoreResource;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class IndexController extends Controller
{
    public function handle(): JsonResponse
    {
        return new JsonResponse(StoreResource::collection(Store::query()->orderBy('sort')->get()));
    }
}
