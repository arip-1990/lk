<?php

namespace App\Http\Controllers\V1\User;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function handle(): JsonResponse
    {
        if (!Auth::check() or Auth::user()->role->name === 'worker')
            return new JsonResponse(['message' => 'Доступ запрещен!'], 403);

        return new JsonResponse(UserResource::collection(User::all()));
    }
}
