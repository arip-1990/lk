<?php

namespace App\Http\Controllers\V1\Training;

use App\Models\Training;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;

class DeleteController extends Controller
{
    public function handle(Training $training): JsonResponse
    {
        foreach (Storage::files('trainings') as $file) {
            $tmp = explode('/', $file);
            if (str_starts_with($tmp[count($tmp) - 1], $training->id))
                Storage::delete($file);
        }
        $training->delete();

        return new JsonResponse();
    }
}
