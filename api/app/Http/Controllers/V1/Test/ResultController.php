<?php

namespace App\Http\Controllers\V1\Test;

use App\Models\Test;
use App\UseCases\TestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class ResultController extends Controller
{
    public function __construct(private readonly TestService $testService) {}

    public function handle(Test $test): JsonResponse
    {
        $results = $this->testService->getResults($test);
        $totalRes = $results->count();
        $percent = $totalRes ? $test->score / $totalRes * 100 : 0;

        return new JsonResponse([
            'total' => $test->score,
            'percent' => round($percent, 2),
            'data' => $results->toArray(),
            'start' => $test->created_at->format('Y-m-d H:i:s'),
            'finish' => $test->finished_at->format('Y-m-d H:i:s')
        ]);
    }
}
