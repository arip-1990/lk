<?php

namespace App\Http\Controllers\V1\Broadcast;

use denis660\Centrifugo\Centrifugo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AuthController extends Controller
{
    public function handle(Centrifugo $centrifuge, Request $request): JsonResponse
    {
        return new JsonResponse([
            'token' => $centrifuge->generatePrivateChannelToken(
                $request->user()->id,
                "notify:App.Models.User.{$request->user()->id}",
                time() + 5 * 60,
                ['name' => $request->user()->name]
            )
        ]);
    }
}
