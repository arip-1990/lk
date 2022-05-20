<?php

namespace App\Http\Controllers\V1\OperationDepartment\Contact;

use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class DeleteController extends Controller
{
    public function handle(Contact $contact): JsonResponse
    {
        $contact->delete();

        return new JsonResponse();
    }
}
