<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Models\Statement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

        return new JsonResponse();
    }
}
