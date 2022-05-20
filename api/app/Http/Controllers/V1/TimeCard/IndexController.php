<?php

namespace App\Http\Controllers\V1\TimeCard;

use App\Http\Resources\TimeCardResource;
use App\Models\Store;
use App\Models\TimeCard;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class IndexController extends Controller
{
    public function handle(Request $request, Store $store): JsonResponse
    {
        $date = Carbon::parse($request->get('period'));

        return new JsonResponse(TimeCardResource::collection(
            TimeCard::query()->where('store_id', $store->id)
                ->whereBetween('created_at', [$date->startOfMonth(), $date->clone()->endOfMonth()])->get()
        ));
    }
}
