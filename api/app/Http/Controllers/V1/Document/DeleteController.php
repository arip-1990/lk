<?php

namespace App\Http\Controllers\V1\Document;

use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;

class DeleteController extends Controller
{
    public function handle(Document $document): JsonResponse
    {
        if (!Storage::delete("documents/{$document->id}.{$document->type}"))
            return new JsonResponse(['message' => 'Не удалось удалить файл!'], 500);

        $document->delete();

        return new JsonResponse();
    }
}
