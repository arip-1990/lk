<?php

namespace App\Http\Controllers\V1\TimeCard;

use App\Models\TimeCard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\Response;

class StoreController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        foreach ($request->all() as $item) {
            /** @var TimeCard $timeCard */
            $timeCard = TimeCard::find($item['timeCard']);

            $attendances = new Collection();
            foreach ($item['attendance'] as $tmp) {
                $attendances->add(['status' => $tmp['status'], 'hours' => $tmp['hours']]);
            }
            $timeCard->update(['attendance' => $attendances]);
        }

        return new JsonResponse(status: Response::HTTP_CREATED);
    }
}
