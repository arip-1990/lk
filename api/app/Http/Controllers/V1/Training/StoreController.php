<?php

namespace App\Http\Controllers\V1\Training;

use App\Models\Category;
use App\Models\Training;
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
    public function handle(Category $category, Request $request): JsonResponse
    {
        $training = new Training([
            'id' => Uuid::uuid4()->toString(),
            'title' => $request->get('title'),
            'user_id' => Auth::id(),
            'link' => $request->get('link'),
            'type' => $request->get('type'),
            'category_id' => $category->id
        ]);

        if (!$request->get('link')) {
            /** @var UploadedFile $file */
            $file = $request->file('file');
            if ($file and $file->getError() === UPLOAD_ERR_OK) {
                if (!Storage::exists('trainings'))
                    Storage::makeDirectory('trainings');

                Storage::putFileAs('trainings', $file, $training->id . '.' . $file->getClientOriginalExtension());

                if ($file->getClientOriginalExtension() === 'pdf')
                    $training->type = Training::TYPE_DOCUMENT;
            }
        }
        $training->save();

        return new JsonResponse(status: Response::HTTP_CREATED);
    }
}
