<?php

namespace App\Http\Controllers\V1\User;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        if (!Auth::check() or Auth::user()->role->name === 'worker')
            return new JsonResponse(['message' => 'Доступ запрещен!'], 403);

        if ($request->get('role')) {

            $users = User::whereHas('role', function ($query) use ($request) {
                $query->where('name', $request->get('role'));
            })->with('role')->get();

            $users = $users->sortBy(function ($user) {
                return $user->role->name;
            });

            $userResources = UserResource::collection($users);
        }else{
            $userResources = UserResource::collection(User::all());
        }

        return new JsonResponse($userResources);
    }
}
