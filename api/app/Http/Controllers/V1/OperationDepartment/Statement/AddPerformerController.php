<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Models\Statement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AddPerformerController extends Controller
{
    public function __invoke(Request $request, Statement $statement): JsonResponse
    {
        $statement->performer_id = $request->user()->id;
        $statement->save();

        return new JsonResponse();
    }
}
