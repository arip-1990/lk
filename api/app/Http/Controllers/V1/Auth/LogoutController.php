<?php

namespace App\Http\Controllers\V1\Auth;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class LogoutController extends Controller
{
    public function handle(): JsonResponse
    {
        Auth::user()->tokens()->delete();

        return new JsonResponse(status: Response::HTTP_NO_CONTENT);
    }
}
