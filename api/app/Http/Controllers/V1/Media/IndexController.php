<?php

namespace App\Http\Controllers\V1\Media;

use App\Http\Resources\MediaResource;
use App\Models\Category;
use App\Models\Media;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class IndexController extends Controller
{
    public function handle(Category $category, Store $store = null): JsonResponse
    {
        return new JsonResponse(MediaResource::collection(
            Media::query()->where('category_id', $category->id)->where('store_id', $store?->id)->get()
        ));
    }
}
