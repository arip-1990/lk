<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Events\StatementCreated;
use App\Models\Category;
use App\Models\Statement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;

class StoreController extends Controller
{
    public function handle(Request $request, Category $category): JsonResponse
    {
        try {
            $statement = Statement::create([
                'id' => Uuid::uuid4()->toString(),
                'must' => $request->get('must'),
                'category_id' => $category->id,
                'user_id' => $request->user()?->id,
                'store_id' => $request->get('store')
            ]);

            if (!Storage::exists($statement->getMediaPath()))
                Storage::makeDirectory($statement->getMediaPath());

            /** @var UploadedFile $file */
            foreach ($request->file('medias', []) as $i => $file) {
                if ($file->getError() === UPLOAD_ERR_OK) {
                    $file->storeAs($statement->getMediaPath(), "{$statement->id}_{$i}." . strtolower($file->getClientOriginalExtension()));
                }
            }

            broadcast(new StatementCreated($request->user(), $statement));
        }
        catch (\Exception $e) {
            return new JsonResponse(
                ['message' => $e->getMessage()],
                status: Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return new JsonResponse(status: Response::HTTP_CREATED);
    }
}
