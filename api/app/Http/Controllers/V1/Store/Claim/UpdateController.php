<?php

namespace App\Http\Controllers\V1\Store\Claim;

use App\Models\Claim;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class UpdateController extends Controller
{
    public function handle(Claim $claim, Request $request): JsonResponse
    {
        $claim->update([
            'invoice' => $request->get('invoice'),
            'provider_id' => $request->get('provider'),
            'delivery_at' => $request->get('deliveryAt'),
            'not_delivery' => $request->get('notDelivery'),
            'not_attachment' => $request->get('notAttachment'),
            'regrading' => $request->get('regrading'),
            'short_shelf_life' => $request->date('shortShelfLife'),
        ]);

        return new JsonResponse();
    }
}
