<?php

namespace App\Http\Controllers\V1\Store\Claim;

use App\Http\Resources\ClaimResource;
use App\Models\Claim;
use App\Models\Store;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function handle(Request $request, Store $store = null): JsonResponse | JsonResource
    {
        if ($store) {
            $query = Claim::query()->where('store_id', $store->id)->orderBy('created_at');

            return ClaimResource::collection($query->paginate($request->get('pageSize', 10)));
        }
        else {
            $query = Claim::query();
            if (Auth::user()->stores()->count())
                $query->whereIn('store_id', Auth::user()->stores);

            $date = Carbon::parse($request->get('period', 'now'));
            $query->whereBetween('created_at', [$date->startOfDay(), $date->clone()->endOfDay()])->orderBy('created_at');

            return new JsonResponse(ClaimResource::collection($query->get()));
        }
    }
}
