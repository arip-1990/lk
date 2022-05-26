<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Models\Category;
use App\Models\Statement;
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
    public function handle(Request $request, Category $category): JsonResponse
    {
        $statement = Statement::query()->create([
            'id' => Uuid::uuid4()->toString(),
            'must' => $request->get('must'),
            'category_id' => $category->id,
            'user_id' => Auth::id(),
            'store_id' => $request->get('store')
        ]);

        if (!Storage::exists($statement->getMediaPath()))
            Storage::makeDirectory($statement->getMediaPath());
        /** @var UploadedFile $file */
        foreach ($request->file('media', []) as $i => $file) {
            if ($file->getError() === UPLOAD_ERR_OK) {
                Storage::putFileAs($statement->getMediaPath(), $file, $statement->id . '_' . $i . '.' . $file->getClientOriginalExtension());
            }
        }

        return new JsonResponse(status: Response::HTTP_CREATED);
    }
}
