<?php

namespace App\Http\Controllers\V1\Store\Claim;

use App\Models\Claim;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;

class StoreController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        foreach ($request->all() as $item) {
            Claim::query()->create([
                'id' => Uuid::uuid4()->toString(),
                'invoice' => $item['invoice'],
                'provider_id' => $item['provider'],
                'store_id' => $item['store'],
                'user_id' => Auth::id(),
                'not_attachment' => $item['notAttachment'],
                'regrading' => $item['regrading'],
                'short_shelf_life' => $item['shortShelfLife'],
            ]);
        }

        return new JsonResponse(status: Response::HTTP_CREATED);
    }
}
