<?php

namespace App\Http\Controllers\V1\Auth;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class LoginController extends Controller
{
    public function handle(LoginRequest $request): JsonResponse
    {
        if (!$user = User::where('barcode', $request->get('barcode'))->first())
            return new JsonResponse('Учетные данные не совпадают', 401);

        $user->tokens()->delete();

        return new JsonResponse(['token' => $user->createToken($request->userAgent())->plainTextToken]);
    }
}
