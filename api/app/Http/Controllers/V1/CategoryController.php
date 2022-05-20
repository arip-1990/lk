<?php

namespace App\Http\Controllers\V1;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class CategoryController extends Controller
{
    public function handle(): JsonResponse
    {
        return new JsonResponse(CategoryResource::collection(Category::query()->withRoot()->orderBy('sort')->get()));
    }
}
