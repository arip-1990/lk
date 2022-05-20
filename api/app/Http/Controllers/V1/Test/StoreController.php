<?php

namespace App\Http\Controllers\V1\Test;

use App\Models\Test;
use App\UseCases\TestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class StoreController extends Controller
{
    public function __construct(private readonly TestService $testService) {}

    public function handle(Request $request): JsonResponse
    {
        $test = Test::query()->find($request->get('test'));
        if ($test?->user_id !== Auth::id())
            throw new \DomainException('Ошибка теста.');

        if ($test->finished_at)
            throw new \DomainException('Тест уже завершен.');

        $this->testService->store($test, $request->get('results'));

        return new JsonResponse(status: Response::HTTP_CREATED);
    }
}
