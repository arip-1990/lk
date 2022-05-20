<?php

namespace App\Http\Controllers\V1\Document;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\DocumentResource;
use App\Models\Category;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class IndexController extends Controller
{
    public function handle(Category $category): JsonResponse
    {
        return new JsonResponse([
            'categories' => CategoryResource::collection($category->children),
            'documents' => DocumentResource::collection(Document::query()->where('category_id', $category->id)->get())
        ]);
    }
}
