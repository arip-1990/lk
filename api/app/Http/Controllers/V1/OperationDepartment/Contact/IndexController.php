<?php

namespace App\Http\Controllers\V1\OperationDepartment\Contact;

use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class IndexController extends Controller
{
    public function handle(): JsonResponse
    {
        return new JsonResponse(ContactResource::collection(Contact::all()));
    }
}
