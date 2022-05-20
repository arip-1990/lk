<?php

namespace App\Http\Controllers\V1\Media;

use App\Models\Category;
use App\Models\Media;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;

class StoreController extends Controller
{
    public function handle(Request $request, Category $category, Store $store = null): JsonResponse
    {
        if (!$request->get('title'))
            return new JsonResponse(['message' => 'Некорректные данные!'], 500);

        $media = new Media([
            'id' => Uuid::uuid4()->toString(),
            'title' => $request->get('title'),
            'type' => Media::TYPE_IMAGE,
            'category_id' => $category->id,
            'user_id' => Auth::id(),
            'store_id' => $store?->id
        ]);

        /** @var UploadedFile $file */
        $file = $request->file('file');
        if ($file and $file->getError() === UPLOAD_ERR_OK) {
            if (!Storage::exists($media->getMediaPath()))
                Storage::makeDirectory($media->getMediaPath());

            Storage::putFileAs($media->getMediaPath(), $file, $media->id . '.' . $file->getClientOriginalExtension());

            if ($file->getClientOriginalExtension() === 'pdf')
                $media->type = Media::TYPE_DOCUMENT;
        }
        $media->save();

        return new JsonResponse(status: Response::HTTP_CREATED);
    }
}
