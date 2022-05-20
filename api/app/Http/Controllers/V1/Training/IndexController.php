<?php

namespace App\Http\Controllers\V1\Training;

use App\Http\Resources\TrainingResource;
use App\Models\Category;
use App\Models\Training;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class IndexController extends Controller
{
    public function handle(Category $category, string $type = null): JsonResponse
    {
        if ($category->type !== Category::TYPE_TRAINING)
            throw new \DomainException('Неправильные данные!');

        $trainings = Training::query()->where('category_id', $category->id)
            ->where('type', $type ?? Training::TYPE_VIDEO)->get();

        return new JsonResponse(TrainingResource::collection($trainings));
    }
}
