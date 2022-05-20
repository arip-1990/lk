<?php

namespace App\Http\Controllers\V1\User;

use App\Http\Resources\TestResource;
use App\Models\Category;
use App\Models\Test;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Routing\Controller;

class TestController extends Controller
{
    public function handle(User $user, Request $request): JsonResource
    {
        $categoryIds = Category::query()->where('type', Category::TYPE_TEST)
            ->where('name', $request->get('type', 'Базовые'))->pluck('id');
        $data = Test::query()->where('user_id', $user->id)->whereIn('category_id', $categoryIds)
            ->whereNotNull('finished_at')->paginate($request->get('pageSize', 10));

        return TestResource::collection($data);
    }
}
