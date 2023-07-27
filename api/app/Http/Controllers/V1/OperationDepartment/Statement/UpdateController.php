<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Http\Requests\OperationDepartment\Statement\UpdateRequest;
use App\Models\Statement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controller;

class UpdateController extends Controller
{
    public function handle(UpdateRequest $request, Statement $statement): JsonResponse
    {
        $data = $request->validated();
        $statement->update([...$data, 'done_at' => $data['doneAt']]);

        if (isset($data['answerMedias'])) {
            /** @var UploadedFile $file */
            foreach ($data['answerMedias'] as $i => $file) {
                if ($file->getError() === UPLOAD_ERR_OK) {
                    $file->storeAs($statement->getMediaPath(), "answer_{$statement->id}_{$i}." . strtolower($file->getClientOriginalExtension()));
                }
            }
        }

        return new JsonResponse();
    }
}
