<?php

namespace App\Http\Controllers\V1\Broadcast;

use denis660\Centrifugo\Centrifugo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ConnectController extends Controller
{
    public function handle(Centrifugo $centrifuge, Request $request): JsonResponse
    {
        return new JsonResponse([
            'token' => $centrifuge->generateConnectionToken(
                $request->user()->id,
                0,
                ['name' => $request->user()->name],
                ["notify:App.Models.User.{$request->user()->id}"]
            )
        ]);
    }
}
