<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Models\Category;
use App\Models\Role;
use App\Models\Statement;
use App\Models\User;
use denis660\Centrifugo\Centrifugo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;

class StoreController extends Controller
{
    public function handle(Request $request, Category $category, Centrifugo $centrifuge): JsonResponse
    {
        try {
            $statement = Statement::create([
                'id' => Uuid::uuid4()->toString(),
                'must' => $request->get('must'),
                'category_id' => $category->id,
                'applicant_id' => $request->user()?->id,
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

            $centrifuge->broadcast(
                User::where('role_id', Role::firstWhere('name', Role::ADMIN)?->id)
                    ->pluck('id')->map(fn($id) => "notify:App.Models.User.{$id}")->toArray(),
                ['title' => $statement->category->name, 'message' => $statement->must]
            );

//            Notification::send(User::where('role_id', Role::firstWhere('name', Role::ADMIN)?->id)->get(), new StatementCreated($statement));
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
