<?php

namespace App\Http\Controllers\V1\Provider;

use App\Http\Resources\ProviderResource;
use App\Models\Provider;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class IndexController extends Controller
{
    public function handle(): JsonResponse
    {
        return new JsonResponse(ProviderResource::collection(Provider::all()));
    }
}
