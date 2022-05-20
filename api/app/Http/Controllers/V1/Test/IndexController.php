<?php

namespace App\Http\Controllers\V1\Test;

use App\Http\Resources\QuestionResource;
use App\Models\Category;
use App\Models\Test;
use App\UseCases\QuestionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Ramsey\Uuid\Uuid;

class IndexController extends Controller
{
    public function __construct(private readonly QuestionService $service) {}

    public function handle(Category $category): JsonResponse
    {
        $questions = $this->service->randomTestQuestions($category);
        $test = null;
        if (count($questions)) {
            $test = Test::query()->create([
                'id' => Uuid::uuid4()->toString(),
                'category_id' => $category->id,
                'user_id' => Auth::id()
            ]);
        }

        return new JsonResponse([
            'test' => $test?->id,
            'questions' => QuestionResource::collection($questions)
        ]);
    }
}
