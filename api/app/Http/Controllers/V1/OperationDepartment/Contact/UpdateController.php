<?php

namespace App\Http\Controllers\V1\OperationDepartment\Contact;

use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class UpdateController extends Controller
{
    public function handle(Request $request, Contact $contact): JsonResponse
    {
        $contact->update(['description' => $request->date('description')]);
        $contact->users()->sync($request->get('contacts', []));

        return new JsonResponse();
    }
}
