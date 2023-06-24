<?php

namespace App\Http\Controllers\V1\Auth;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\Response;

class LogoutController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return new JsonResponse(status: Response::HTTP_NO_CONTENT);
    }
}
