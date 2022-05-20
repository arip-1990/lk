<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Models\Statement;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;

class DeleteController extends Controller
{
    public function handle(Statement $statement): JsonResponse
    {
        foreach (Storage::files($statement->getMediaPath()) as $file) {
            $tmp = explode('/', $file);
            if (str_starts_with($tmp[count($tmp) - 1], $statement->id))
                Storage::delete($file);
        }

        $statement->delete();

        return new JsonResponse();
    }
}
