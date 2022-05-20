<?php

namespace App\Http\Controllers\V1\Media;

use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;

class DeleteController extends Controller
{
    public function handle(Media $media): JsonResponse
    {
        foreach (Storage::files($media->getMediaPath()) as $file) {
            $tmp = explode('/', $file);
            if (str_starts_with($tmp[count($tmp) - 1], $media->id))
                Storage::delete($file);
        }
        $media->delete();

        return new JsonResponse();
    }
}
