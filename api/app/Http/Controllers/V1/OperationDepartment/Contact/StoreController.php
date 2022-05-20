<?php

namespace App\Http\Controllers\V1\OperationDepartment\Contact;

use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Response;

class StoreController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        /** @var Contact $contact */
        $contact = Contact::query()->create([
            'id' => Uuid::uuid4()->toString(),
            'description' => $request->get('description')
        ]);
        $contact->users()->sync($request->get('contacts', []));

        return new JsonResponse(status: Response::HTTP_CREATED);
    }
}
