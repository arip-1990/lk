<?php

namespace App\Http\Controllers\V1\Document;

use App\Models\Category;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;

class StoreController extends Controller
{
    public function handle(Category $category, Request $request): JsonResponse
    {
        if (!$request->get('name'))
            throw new \DomainException('Отсутствует название документа!');

        $document = Document::create([
            'id' => Uuid::uuid4()->toString(),
            'title' => $request->get('name'),
            'category_id' => $category->id,
            'type' => Document::TYPE_PDF
        ]);

        /** @var UploadedFile $file */
        $file = $request->file('file');
        if ($file and $file->getError() === UPLOAD_ERR_OK) {
            if (!Storage::exists('documents'))
                Storage::makeDirectory('documents');

            $file->storeAs('documents', $document->id . '.' . $file->getClientOriginalExtension());
        }

        return new JsonResponse(status: Response::HTTP_CREATED);
    }
}
