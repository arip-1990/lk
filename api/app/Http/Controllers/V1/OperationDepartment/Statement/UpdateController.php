<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Models\Statement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controller;

class UpdateController extends Controller
{
    public function handle(Request $request, Statement $statement): JsonResponse
    {
        $statement->update([
            'done_at' => $request->date('doneAt'),
            'comment' => $request->get('comment'),
            'status' => $request->get('status', false),
        ]);

        /** @var UploadedFile $file */
        foreach ($request->file('answerMedias', []) as $i => $file) {
            if ($file->getError() === UPLOAD_ERR_OK) {
                $file->storeAs($statement->getMediaPath(), "answer_{$statement->id}_{$i}." . strtolower($file->getClientOriginalExtension()));
            }
        }

        return new JsonResponse();
    }
}
