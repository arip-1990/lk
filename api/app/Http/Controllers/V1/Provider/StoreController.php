<?php

namespace App\Http\Controllers\V1\Provider;

use App\Http\Resources\StoreResource;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{
    public function handle(): JsonResponse
    {
        $stores = StoreResource::collection(Auth::user()->stores()->count() ? Auth::user()->stores : Store::all());

        return new JsonResponse($stores);
    }
}
