<?php

namespace App\Http\Resources;

use App\Models\Contact;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    public function toArray($request): array
    {
        /** @var Contact $this */
        return [
            'id' => $this->id,
            'description' => $this->description,
            'contacts' => UserResource::collection($this->users),
            'createdAt' => $this->created_at?->format('Y-m-d'),
        ];
    }
}
